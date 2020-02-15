import React from 'react';
import { Form, Input, Button, message } from 'antd';
import $ from 'jquery';
import { Link } from "react-router-dom";
import {API_ROOT} from "../constants";

class RegistrationForm extends React.Component {
state = {
    confirmDirty: false,
};

handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
            console.log('Received values of form: ', values);
            $.ajax({
                url: `${API_ROOT}/signup`,
                method: 'POST',
                data: JSON.stringify({
                    username: values.username,
                    password: values.password
                })
            }).then((response) => {
                this.props.history.push('/login');
                message.success(response);
            }).catch((error) => {
                message.error(error.responseText);
            });
        }
    });
};

handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
};

compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
    callback('Two passwords that you enter is inconsistent!');
    } else {
    callback();
    }
};

validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
    form.validateFields(['confirm'], { force: true });
    }
    callback();
};

render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
    };
    const tailFormItemLayout = {
    wrapperCol: {
        xs: {
        span: 24,
        offset: 0,
        },
        sm: {
        span: 16,
        offset: 8,
        },
    },
    };


    return (
    <Form {...formItemLayout} onSubmit={this.handleSubmit} className="register-form">
        <Form.Item label="Username" hasFeedback>
        {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!', whitespace: true }],
        })(<Input />)}
        </Form.Item>
        <Form.Item label="Password" hasFeedback>
        {getFieldDecorator('password', {
            rules: [
            {
                required: true,
                message: 'Please input your password!',
            },
            {
                validator: this.validateToNextPassword,
            },
            ],
        })(<Input.Password />)}
        </Form.Item>
        <Form.Item label="Confirm Password" hasFeedback>
        {getFieldDecorator('confirm', {
            rules: [
            {
                required: true,
                message: 'Please confirm your password!',
            },
            {
                validator: this.compareToFirstPassword,
            },
            ],
        })(<Input.Password onBlur={this.handleConfirmBlur} />)}
        </Form.Item>
        
        
        <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
            Register
        </Button>
        <p>I already have an account, go back to <Link to="/login">go to login</Link> </p>
        </Form.Item>
    </Form>
    );
}
}

export const Register = Form.create()(RegistrationForm);
