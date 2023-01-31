import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import {App} from "./App";
import {BrowserRouterDecorator, reduxStoreProviderDecorator} from "../stories/ReduxStoreProviderDecorator";

export default {
    title: 'Application Component',
    component: App,
    // decorators: [reduxStoreProviderDecorator],
    decorators: [reduxStoreProviderDecorator, BrowserRouterDecorator],
} as unknown as ComponentMeta<typeof App>;

const Template: ComponentStory<typeof App> = (args) => <App demo={true}/>;

export const AppExample = Template.bind({});

