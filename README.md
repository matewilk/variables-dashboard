# Kubernetes Dashboard

## Getting started
[Install and configure](https://developer.newrelic.com/build-apps/ab-test/install-nr1/) `nr1 cli`

### Development

Run the following scripts to install dependencies:
```
npm install
```

Generate new nerdpack uuid (if you're moving the nerdpack between NR accounts):
```
nr1 nerdpack:uuid -gf
```

Start the nerdpack:
```
npm run start
```
OR
```
nr1 nerdpack:serve
```
Visit https://one.newrelic.com/?nerdpacks=local and :sparkles:

See NR [Serve your Nerdpack](https://developer.newrelic.com/build-apps/publish-deploy/serve) docs for more details

### Publish your nerdpack

In short run the following commands:
```
nr1 nerdpack:publish
nr1 nerdpack:subscribe
```
You might also [Tag your Nerdpack](https://developer.newrelic.com/build-apps/publish-deploy/tag)

If you want to remove nerdpack from your NR account run:
```
nr1 nerdpack:unsubscribe
nr1 nerdpack:undeploy
```
Refer to [Publish your Nerdpack](https://developer.newrelic.com/build-apps/publish-deploy/publish) & [Subscribe to your Nerdpack](https://developer.newrelic.com/build-apps/publish-deploy/subscribe) docs for more details

## Architecture

### Filter (Context) Provider
Context provides a way to pass data through the component tree without having to pass props down manually at every level. Read more about the Context Provider pattern on the official React [docs pages](https://reactjs.org/docs/context.html)

`FilterProvider` wraps the whole application in `App.js` providing filter properties to all the vital components of the app (namely `FilterForm`, `MultiSelect`, `hooks` and all types of charts like `CpuUtilisation`, `MemoryUtilisation`, `IncidentsChart` etc.)

This pattern provides the ability to share `FilterForm`, `MultiSelect` and `PlatformState` (for the time picker) state across the application and update charts accordingly to what is selected in the filter form or the time picker.

The following states are used by `FilterContextProvider`:
- `filter` & `setFilter` - those are used by `MultiSelect` component to set individual values for a specific filter (like `cluster`, `service`, `facet` or `timeseries`)
- `appliedFilter` & `setAppliedFilter` - those are used when pressing the `Filter` button and it applies all the individual `filter`s from the above and the button click propagates the values across the application (using `setAppliedFilter` and `hooks` - read about hooks below)
- `platformState` - this property is passed to `FilterProvider` from `NR1` platform using [PlatformStateContext](https://developer.newrelic.com/components/platform-state-context/) and is later on used by `usePlatformState` hook (read about it below) to read the NR1 platform time picker selected value.

### Hooks
Read about hooks on the official React [docs pages](https://reactjs.org/docs/hooks-intro.html)

This application uses standard React hooks `useState` and `useMemo` in the `FilterContextProvider` component.

Apart from the standard React hooks, there are thee other, custom hooks used by the app to propagate the application state:

#### useFilter
- this hook returns `filter`, `setFilter` & `appliedFilter`, `setAppliedFilter` so that they are accessible across the app
- `useFilter` is used by `FilterForm` to apply selected with `MultiSelect` components filters 
#### userPlatformState
- this hook returns `timeRangePlatformState` which is a representation of the NR1 platform time picker state translated to time that can be applied to `NRQL` queries (used in chart components)
- example values of `timeRangePlatformState` are:
    - `SINCE 3 HOURS AGO`
    - `SINCE 1654251376438 UNTIL 1654262176438`
#### useQuery
- this hook returns values applied by the `FilterForm` upon pressing `Filter` button
    - `cluster`, `service`, `facet` and `timeseries` dropdown values
- those values are translated to `NRQL` readable values and can be applied to a `NRQL` query as strings
### FilterForm
`FilterForm` component is an html form component with a collection of `MultiSelect` components

It  uses `useFilter` hook to apply (using `setAppliedFilter`) `filter` values 

#### MultiSelect
`MultiSelect` is a dropdown component wrapping (React Select)[https://react-select.com/home] component and adding a few extra functionalities on top:
- it accepts the following properties
    - `name` - (required) used to identify the dropdown and apply filter base on it (has to be a string without special characters)
        - it also works a placeholder text if `label` is not provided
    - `label` - (optional) - placeholder text for the dropdown
    - `initialOptions` - (optional) - an array of initial options (or options)
        - each element of the options array has to be an object containing `label` and `value` properties
    - `isMulti` - (optional) - set to `false` as default - indicates whether the dropdown should be mutlti-select or not.
    - `isAsync` - (optional) - set to `false` as default - indicates whether the dropdown should fetch data from `NRDB` usind `NRQL` query
    - `query` - (optional) - but required if `isAsync` is set to `true` - pass `NRQL` query using this property to fetch data from `NRDB`
- it uses `useFilter` hook to `setFilter` value for the specific attribute
    - for example if the `name` is set to `service` upon selecting the value, the `filter` value for `service` will be applied and propagated across the app (upon pressing `FilterForm`'s `Filter` button)
### Charts
Each chart component uses two hooks:
- `useQuery` - to get the latest values from the dropdowns (translated to `NRQL` query readable format)
- `usePlatformState` - to get `timeRangePlatformState` which is an `NRQL` query readable format of data from the `nr1` time picker

Values from `useQuery` and `usePlatformState` are then used to build an `NRQL` query.

Once the query is built (constructed from strings returned from the hooks):
- it is passed to [NrqlQuery](https://developer.newrelic.com/components/nrql-query/) components
- `NrqlQuery` returns data from `NRDB` in the appropriate format that can be digested by a [Charts](https://developer.newrelic.com/components/charts) component
- depending on the chart type, data is then passed to a chart component, for example [LineChart](https://developer.newrelic.com/components/line-chart), [AreaChart](https://developer.newrelic.com/components/area-chart) etc.


#### Gauge Chart
`Gauge` chart is a specific type of chart as it uses [recharts](https://recharts.org/en-US/) library to build a custom chart.
- it calculates percentage based on the data returned from `NRDB` and the `SELECT` value passed to it has to be translated to `results` by using it in the `NRQL` query like this: `SELECT xyz AS results FROM ...` - otherwise, the `Gauge` component won't be able to read and apply the received data as expected.

### Application workflow
The application is wrapped with `FilterProvider` thus upon the application start, all the components have access to values provided by the provider context specifically the custom hooks (`useQuery`, `useFilter` & `useStateProvider`). The app also passes `PlatformStateContext` to the provider so it has access to the `nr1` platform time picker state.

`FilterForm` contains a collection `MultiSelect` components. When selecting a value from a (`MultiSelect`) dropdown:
- `filter` state changes (modified by individual `MultiSelect` components by using `setFilter` returned from `useFilter` hook)
- every dropdown select event triggers `onChange` event that updates `filter` value for that specific dropdown
- every dropdown adds its own value to `filter` state

An example of the `filter` state object upon selecting `cluster`, `service` and `facet by cluster` dropdowns looks like this:
```
{
    "cluster": [
        {
            "label": "github-actions-1-eu-west-1-1",
            "value": "github-actions-1-eu-west-1-1"
        }
    ],
    "service": {
        "label": "atlantis",
        "value": "atlantis"
    },
    "facetbycluster": {
        "label": "true",
        "value": true
    }
}
```

When the `FilterForm`'s `Filter` button is pressed it applies the `filter` state using `setAppliedFilter` and propagates the change across the whole app. It effectively copies `filter` property to `appliedFilter` property.

The `appliedFilter` object is then interpreted (read) by `useQuery` hook and transformed (translated) to `NRQL` query readable values which then can be used in `NRQL` queries.

Since all chart components use `useQuery` hook, whenever React (the specific chart component) gets new values from `useQuery` hook it applies them to that chart component `NRQL` query and passes it to `NrqlQuery` which in turn returns data (from `NRDB`) to the chart.
