import React from 'react';
import { shallow, mount } from 'enzyme';

import Form from '../../../client/app/components/form/form.jsx';

describe('Form Component', () => {
    let wrapper;
    let definition = {
        submitText: 'Submit',
        fields: []
    };

    it('should fetch validations on startup', async function() {
        const definition = {
            submitText: 'Submit',
            fields: [
                {
                    name: "name",
                    label: "Name",
                    type: "text",
                    default: ""
                }
            ]
        };

        const wrapper = await mount(<Form definition={definition} endpoint="POST /api/fake"/>)
        
        setImmediate(() => {
            expect(wrapper.instance().validations.length).toBe(0)
        });        
    })

    it('should run validations on blur', async function() {
        const spy = jest.spyOn(Form.prototype, 'validate');

        const definition = {
            submitText: 'Submit',
            fields: [
                {
                    name: "name",
                    label: "Name",
                    type: "text",
                    default: ""
                }
            ]
        };

        const wrapper = await shallow(<Form definition={definition} endpoint="POST /api/fake"/>)

        setImmediate(() => {
            spy.mockReset()
            const input = wrapper.find('input').first()
            input.name = "name"
            input.simulate('blur', {target: input})
            expect(spy).toBeCalled()
        })
    })
    

    it('should run validations on keypress if input is the last input', async function() {
        const spy = jest.spyOn(Form.prototype, 'validate')
        const changeSpy = jest.spyOn(Form.prototype, 'handleChange')
        
        const definition = {
            submitText: 'Submit',
            fields: [
                {
                    name: "name",
                    label: "Name",
                    type: "text",
                    default: ""
                },
                {
                    name: "email",
                    label: "Email",
                    type: "text",
                    default: ""
                }
            ]
        };
        const wrapper = await shallow(<Form definition={definition} endpoint="POST /api/fake"/>)

        setImmediate(() => {
            spy.mockReset()
            wrapper.find('input').first().simulate('change', {target: {name: 'name'}})
            expect(spy).not.toBeCalled()
            expect(changeSpy).toBeCalled()
            const input = wrapper.find('input').at(1)
            input.simulate('change', {target: {name: 'email'}})
            expect(spy).toBeCalled()
        })
    })

    it('should only validate dirty inputs', async function() {
        const definition = {
            submitText: 'Submit',
            fields: [
                {
                    name: "name",
                    label: "Name",
                    type: "text",
                    default: "Jack"
                },
                {
                    name: "email",
                    label: "Email",
                    type: "text",
                    default: ""
                }
            ]
        };
        const wrapper = shallow(<Form definition={definition} endpoint="POST /api/fake"/>)
        const instance = wrapper.instance()
        instance.validations = [{fields: ["email"], validators: [], messages: []}, {fields: ["name"], validators: ["exists"], messages: ["name required"]}]
        wrapper.update()
        const nameInput = wrapper.find('input').first()
        await instance.handleBlur({target: {name: "name"}})
        await instance.validate()
        expect(wrapper.state().form.fields[0].beenValidated).toBe(true)
        expect(wrapper.state().form.fields[1].beenValidated).toBe(false)
    })

    it('should create all supported input types', async function() {
        const definition = {
            submitText: 'Submit',
            fields: [
                {
                    name: "email",
                    label: "Email",
                    type: "text",
                    default: ""
                },
                {
                    name: "password",
                    label: "Password",
                    type: "password",
                    default: ""
                }
            ]
        };
        const wrapper = await shallow(<Form definition={definition} endpoint="POST /api/fake"/>)
        expect(wrapper.find('input').length).toBe(definition.fields.length)
    })

    it('should create all supported input types', async function() {
        const definition = {
            submitText: 'Submit',
            fields: [
                {
                    name: "email",
                    label: "Email",
                    type: "text",
                    default: "hello"
                }
            ]
        };
        const wrapper = await shallow(<Form definition={definition} endpoint="POST /api/fake"/>)
        expect(wrapper.instance().getValue("email")).toEqual("hello")
    })

    // should allow submit only when all forms have been touched & validated

    // todo - should not require that optional fields be touched

    it('should display error messages', async function() {
        const definition = {
            submitText: 'Submit',
            fields: [
                {
                    name: "email",
                    label: "Email",
                    type: "text",
                    default: "hello"
                }
            ]
        };
        const wrapper = shallow(<Form definition={definition} endpoint="POST /api/fake"/>)
        const instance = wrapper.instance()
        instance.validations = [{fields: ["email"], validators: ["isEmailFormat"], messages: ["bad email"]}]
        wrapper.find('input').first().simulate('blur', {target: {name: 'email'}})
        await instance.validate()
        expect(instance.getErrorsFor("email").length).toEqual(1)
        wrapper.update()
        expect(wrapper.find(".error-message").length).toEqual(1)
    })
})