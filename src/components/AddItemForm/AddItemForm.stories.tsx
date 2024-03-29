import {ComponentMeta, ComponentStory} from "@storybook/react";
import {AddItemForm} from "./AddItemForm";
import React from "react";
import {action} from "@storybook/addon-actions";

export default {
    title: 'AddItemForm Component',
    component: AddItemForm,
} as ComponentMeta<typeof AddItemForm>;

const asyncCallback = async (...params: any[]) => {
    action("Button 'add' was pressed inside the form")
}

// const callback = action("Button 'add' was pressed inside the form")

const Template: ComponentStory<typeof AddItemForm> = (args) => <AddItemForm {...args} />;

export const AddItemFormBaseExample = Template.bind({});
AddItemFormBaseExample.args = {
    addItem: asyncCallback
};
export const AddItemFormBaseExample2 = Template.bind({});
AddItemFormBaseExample.args = {
    addItem: asyncCallback,
    disabled: true
};