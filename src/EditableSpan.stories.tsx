import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import {action} from "@storybook/addon-actions";
import {EditableSpan} from "./EditableSpan";

export default {
    title: 'EditableSpan Component',
    component: EditableSpan,
} as ComponentMeta<typeof EditableSpan>;

const callback = action("Value changed")

const Template: ComponentStory<typeof EditableSpan> = (args) => <EditableSpan {...args} />;

export const EditableSpanBaseExample = Template.bind({});
EditableSpanBaseExample.args = {
    title: 'Start value',
    onChange: callback
};