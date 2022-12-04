import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import {AppWithRedux} from "./AppWithRedux";
import {reduxStoreProviderDecorator} from "./stories/ReduxStoreProviderDecorator";

export default {
    title: 'AppWithRedux Component',
    component: AppWithRedux,
    decorators: [reduxStoreProviderDecorator],
} as ComponentMeta<typeof AppWithRedux>;

const Template: ComponentStory<typeof AppWithRedux> = (args) => <AppWithRedux />;

export const AppWithReduxExample = Template.bind({});

