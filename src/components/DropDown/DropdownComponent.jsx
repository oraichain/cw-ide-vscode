import { Menu, Dropdown, Button, Space } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import "antd/dist/antd.css";

const DropdownComponent = ({ list }) => {

    const handleMenuClick = (e) => {
        console.log('click', e);
    }

    const menus = (
        list.map(element => {
            return (
                <Menu.Item key={element.key} icon={<UserOutlined />}>
                    {element.network}
                </Menu.Item>
            )
        })
    );

    const menu = (
        <Menu onClick={handleMenuClick}>
            {menus}
        </Menu>
    );

    return (
        <Space wrap>
            <Dropdown overlay={menu} placement="bottomRight">
                <Button >
                    Change network <DownOutlined />
                </Button>
            </Dropdown>
        </Space>
    )
}

export default DropdownComponent;