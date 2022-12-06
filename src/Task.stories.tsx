import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import {Task} from "./Task";
import {Provider} from "react-redux";
import {store} from "./state/store";
import {reduxStoreProviderDecorator} from "./stories/ReduxStoreProviderDecorator";

export default {
    title: 'Task Component',
    component: Task,
    decorators: [reduxStoreProviderDecorator],
} as ComponentMeta<typeof Task>;

const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />;

export const TaskBaseExample1 = Template.bind({});

TaskBaseExample1.args = {
    task:{id:'1', title: 'JS', isDone: true},
    todolistId:'todolistId1'
};

export const TaskBaseExample2 = Template.bind({});
TaskBaseExample2.args = {
    task:{id:'2', title: 'milk', isDone: false},
    todolistId:'todolistId2'
};