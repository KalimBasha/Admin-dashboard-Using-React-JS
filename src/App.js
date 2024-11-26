import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import UserManagement from './components/UserManagement';
import RoleManagement from './components/RoleManagement';
import PermissionManagement from './components/PermissionManagement'; 
const { Header, Content, Sider } = Layout;

const App = () => (
  <Router>
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <Menu theme="dark" mode="inline">
          <Menu.Item key="1">
            <Link to="/">User Management</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/roles">Role Management</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/permissions">Permission Management</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff' }} />
        <Content style={{ margin: '16px' }}>
          <Routes>
            <Route path="/" element={<UserManagement />} />
            <Route path="/roles" element={<RoleManagement />} />
            <Route path="/permissions" element={<PermissionManagement />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  </Router>
);

export default App;
