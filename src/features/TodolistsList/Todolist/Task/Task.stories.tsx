import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import {Task} from "./Task";
import {reduxStoreProviderDecorator} from "../../../../stories/ReduxStoreProviderDecorator";
import {TaskPriorities, TaskStatuses} from "../../../../api/types";

export default {
    title: 'Task Component',
    component: Task,
    decorators: [reduxStoreProviderDecorator],
} as ComponentMeta<typeof Task>;

const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />;

export const TaskBaseExample1 = Template.bind({});

TaskBaseExample1.args = {
    task:{id:'1', title: 'JS', todoListId: 'todoListId1', status: TaskStatuses.Completed,
        description: "", priority: TaskPriorities.Low, startDate: "", deadline: "", order: 0, addedDate: ""},
    todoListId:'todoListId1'
};

export const TaskBaseExample2 = Template.bind({});
TaskBaseExample2.args = {
    task:{id:'2', title: 'milk', todoListId: 'todoListId2', status: TaskStatuses.New,
        description: "", priority: TaskPriorities.Low, startDate: "", deadline: "", order: 0, addedDate: ""},
    todoListId:'todoListId2'
};
