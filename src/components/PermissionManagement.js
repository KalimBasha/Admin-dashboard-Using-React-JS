import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input } from 'antd';
import axios from 'axios';

const PermissionManagement = () => {
  const [permissions, setPermissions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);

  // Fetch Permissions
  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const res = await axios.get('http://localhost:3001/permissions');
      setPermissions(res.data);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  // Add/Edit Permission
  const handleAddEditPermission = async (values) => {
    try {
      if (editingPermission) {
        // Edit Permission
        await axios.put(`http://localhost:3001/permissions/${editingPermission.id}`, values);
      } else {
        // Add New Permission
        await axios.post('http://localhost:3001/permissions', values);
      }
      fetchPermissions();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving permission:', error);
    }
  };

  // Delete Permission
  const deletePermission = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/permissions/${id}`);
      fetchPermissions();
    } catch (error) {
      console.error('Error deleting permission:', error);
    }
  };

  // Table Columns
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Actions',
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setEditingPermission(record);
              setIsModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button type="link" danger onClick={() => deletePermission(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => { setEditingPermission(null); setIsModalOpen(true); }}>
        Add Permission
      </Button>
      <Table
        columns={columns}
        dataSource={permissions.map((p) => ({ ...p, key: p.id }))}
        style={{ marginTop: '20px' }}
      />

      {/* Modal for Add/Edit */}
      <Modal
        title={editingPermission ? 'Edit Permission' : 'Add Permission'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          onFinish={handleAddEditPermission}
          initialValues={editingPermission || { name: '' }}
        >
          <Form.Item
            name="name"
            label="Permission Name"
            rules={[{ required: true, message: 'Please enter a permission name!' }]}
          >
            <Input />
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

export default PermissionManagement;
