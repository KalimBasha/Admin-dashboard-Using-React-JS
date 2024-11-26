import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select } from 'antd';
import axios from 'axios';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  // Fetch roles and permissions on component mount
  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  // Fetch roles from the server
  const fetchRoles = async () => {
    const res = await axios.get('http://localhost:3001/roles');
    setRoles(res.data);
  };

  // Fetch permissions from the server
  const fetchPermissions = async () => {
    const res = await axios.get('http://localhost:3001/permissions');
    setPermissions(res.data);
  };

  // Handle Add/Edit role
  const handleAddEditRole = async (values) => {
    if (editingRole) {
      await axios.put(`http://localhost:3001/roles/${editingRole.id}`, values);
    } else {
      await axios.post('http://localhost:3001/roles', values);
    }
    fetchRoles();
    setIsModalOpen(false);
    setEditingRole(null);
  };

  // Handle Delete Role
  const handleDeleteRole = async (id) => {
    await axios.delete(`http://localhost:3001/roles/${id}`);
    fetchRoles();
  };

  // Table columns
  const columns = [
    {
      title: 'Role Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions) => {
        const permissionNames = permissions.map((id) => {
          const perm = permissions.find((perm) => perm.id === id);
          return perm ? perm.name : '';
        });
        return permissionNames.join(', ');
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            onClick={() => {
              setEditingRole(record);
              setIsModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button danger onClick={() => handleDeleteRole(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Add Role
      </Button>
      <Table
        columns={columns}
        dataSource={roles.map((role) => ({ ...role, key: role.id }))}
        style={{ marginTop: 20 }}
      />

      {/* Modal for Add/Edit */}
      <Modal
        title={editingRole ? 'Edit Role' : 'Add Role'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingRole(null);
        }}
        footer={null}
      >
        <Form
          onFinish={handleAddEditRole}
          initialValues={editingRole || { name: '', permissions: [] }}
        >
          <Form.Item
            name="name"
            label="Role Name"
            rules={[{ required: true, message: 'Please enter a role name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="permissions"
            label="Permissions"
            rules={[{ required: true, message: 'Please select at least one permission!' }]}
          >
            <Select mode="multiple" placeholder="Select Permissions">
              {permissions.map((perm) => (
                <Select.Option key={perm.id} value={perm.id}>
                  {perm.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoleManagement;
