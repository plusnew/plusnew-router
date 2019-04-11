import enzymeAdapterPlusnew, { mount } from 'enzyme-adapter-plusnew';
import { configure } from 'enzyme';
import plusnew, { component, Props, store, Try } from 'plusnew';
import { createRoute, StaticProvider, NotFound } from './index';
import { buildComponentPartial } from './test';

configure({ adapter: new enzymeAdapterPlusnew() });

describe('test router', () => {
  fit('link should be found and be clickable', () => {
    const Component = component(
      'Component',
      (_Props: Props<{ parameter: { param1: string, param2: number } }>) => <div />,
    );

    const route = createRoute(['namespace'], {
      param1: 'string',
      param2: 'number',
    }, Component);

    const urlStore = store('/');

    const wrapper = mount(
      <>
        <urlStore.Observer>{urlState =>
          <StaticProvider url={urlState} onchange={urlStore.dispatch}>
            <route.Link parameter={{ param2: 2, param1: 'foo' }}>link</route.Link>
            <Try
              catch={() => <span>error happened</span>}
            >{() =>
              <route.Component />
            }</Try>
            <NotFound><span>404</span></NotFound>
          </StaticProvider>
        }</urlStore.Observer>
      </>,
    );

    const ComponentPartial = buildComponentPartial(Component);
    expect(wrapper.contains(<span>404</span>)).toBe(true);
    expect(wrapper.contains(<span>error happened</span>)).toBe(false);

    expect(wrapper.containsMatchingElement(<a href="/namespace?param1=foo&param2=2">link</a>)).toBe(true);
    expect(wrapper.containsMatchingElement(<ComponentPartial />)).toBe(false);

    wrapper.find('a').simulate('click');

    expect(urlStore.getState()).toBe('/namespace?param1=foo&param2=2');

    expect(wrapper.contains(<span>404</span>)).toBe(false);
    expect(wrapper.contains(<Component parameter={{ param1: 'foo', param2: 2 }} />)).toBe(true);

    urlStore.dispatch('/namespace?invalid=parameter');

    expect(wrapper.contains(<span>404</span>)).toBe(false);
    expect(wrapper.contains(<span>error happened</span>)).toBe(true);
  });

  it('components should be updatable', () => {
    const Component = component(
      'Component',
      (_Props: Props<{ parameter: { param1: string, param2: number } }>) => <div />,
    );

    const route = createRoute(['namespace'], {
      param1: 'string',
      param2: 'number',
    }, Component);

    const urlStore = store('/');

    const wrapper = mount(
      <>
        <urlStore.Observer>{urlState =>
          <StaticProvider url={urlState} onchange={urlStore.dispatch}>
            <route.Link parameter={{ param2: 2, param1: 'foo' }}>link</route.Link>
            <Try
              catch={() => <span>error happened</span>}
            >{() =>
              <route.Component />
            }</Try>
            <NotFound><span>404</span></NotFound>
          </StaticProvider>
        }</urlStore.Observer>
      </>,
    );

    const ComponentPartial = buildComponentPartial(Component);
    expect(wrapper.contains(<span>404</span>)).toBe(true);
    expect(wrapper.contains(<span>error happened</span>)).toBe(false);

    expect(wrapper.containsMatchingElement(<a href="/namespace?param1=foo&param2=2">link</a>)).toBe(true);
    expect(wrapper.containsMatchingElement(<ComponentPartial />)).toBe(false);

    wrapper.find('a').simulate('click');

    expect(urlStore.getState()).toBe('/namespace?param1=foo&param2=2');

    expect(wrapper.contains(<span>error happened</span>)).toBe(false);
    expect(wrapper.contains(<span>404</span>)).toBe(false);
    expect(wrapper.contains(<Component parameter={{ param1: 'foo', param2: 2 }} />)).toBe(true);

    urlStore.dispatch('/namespace?param1=bar&param2=3');

    expect(wrapper.contains(<span>error happened</span>)).toBe(false);
    expect(wrapper.contains(<span>404</span>)).toBe(false);
    expect(wrapper.contains(<Component parameter={{ param1: 'bar', param2: 3 }} />)).toBe(true);
  });
});
