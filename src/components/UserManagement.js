import React, { useEffect, useState } from 'react';
import { Table, Button, Switch, Modal, Form, Input, Select } from 'antd';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:3001/users');
    setUsers(res.data);
  };

  const handleAddEditUser = async (values) => {
    if (editingUser) {
      await axios.put(`http://localhost:3001/users/${editingUser.id}`, values);
    } else {
      await axios.post('http://localhost:3001/users', values);
    }
    fetchUsers();
    setIsModalOpen(false);
  };

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:3001/users/${id}`);
    fetchUsers();
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Switch
          checked={status === 'Active'}
          onChange={() => {
            const updatedUser = { ...record, status: status === 'Active' ? 'Inactive' : 'Active' };
            axios.put(`http://localhost:3001/users/${record.id}`, updatedUser).then(fetchUsers);
          }}
        />
      ),
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <>
          <Button onClick={() => { setEditingUser(record); setIsModalOpen(true); }}>Edit</Button>
          <Button danger onClick={() => deleteUser(record.id)}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>Add User</Button>
      <Table columns={columns} dataSource={users.map((u) => ({ ...u, key: u.id }))} />

      <Modal
        title={editingUser ? 'Edit User' : 'Add User'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          onFinish={handleAddEditUser}
          initialValues={editingUser || { name: '', email: '', role: '', status: 'Active' }}
        >
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Admin">Admin</Select.Option>
              <Select.Option value="Editor">Editor</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Save</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
