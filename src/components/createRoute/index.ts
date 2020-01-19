import { ComponentContainer } from '@plusnew/core';
import { parameterSpecTemplate, routeContainerToType } from '../../types/mapper';
import { routeContainer } from '../../types/route';
import componentFactory from './componentFactory';
import consumerFactory from './consumerFactory';
import linkFactory from './linkFactory';

export default function createRoute<
  routeName extends string,
  parameterSpec extends parameterSpecTemplate,
  >(
    routeName: routeName,
    parameterSpec: parameterSpec,
    component: ComponentContainer<{ parameter: routeContainerToType<routeName, parameterSpec> }>) {
  return abstractCreateRoute<routeContainerToType<routeName, parameterSpec>>([{
    routeName,
    parameterSpec,
    component,
  }]);
}

function abstractCreateRoute<
  parentParameter,
>(routeChain: routeContainer<any, any, parentParameter>[]) {
  function createChildRoute<
    routeName extends string,
    parameterSpec extends parameterSpecTemplate,
    >(
      routeName: routeName,
      parameterSpec: parameterSpec,
      component: ComponentContainer<{ parameter: parentParameter & routeContainerToType<routeName, parameterSpec> }>) {
    return abstractCreateRoute<parentParameter & routeContainerToType<routeName, parameterSpec>>([...routeChain, {
      routeName,
      parameterSpec,
      component,
    }]);
  }

  return {
    createChildRoute,
    Component: componentFactory(routeChain),
    Link: linkFactory(routeChain),
    Consumer: consumerFactory(routeChain),
  };
}