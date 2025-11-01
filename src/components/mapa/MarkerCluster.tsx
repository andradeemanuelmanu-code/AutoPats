import { createPathComponent } from '@react-leaflet/core';
import L from 'leaflet';
import 'leaflet.markercluster';
import { ReactNode } from 'react';

// This is a custom component to make leaflet.markercluster work reliably with react-leaflet v5+
const MarkerClusterGroup = createPathComponent<L.MarkerClusterGroupOptions, { children?: ReactNode }>(
  ({ children: _c, ...props }, ctx) => {
    const clusterProps: L.MarkerClusterGroupOptions = {};
    const clusterEvents: { [key: string]: (...args: any[]) => void } = {};

    // Splitting props and events to different objects
    Object.entries(props).forEach(([propName, prop]) => {
      if (propName.startsWith('on')) {
        // Convert event prop name to leaflet event name, e.g. onClusterClick -> clusterclick
        const eventName = `${propName.substring(2).toLowerCase()}`;
        clusterEvents[eventName] = prop;
      } else {
        (clusterProps as any)[propName] = prop;
      }
    });

    const instance = new L.MarkerClusterGroup(clusterProps);

    Object.entries(clusterEvents).forEach(([eventName, handler]) => {
      instance.on(eventName, handler);
    });

    return {
      instance,
      context: { ...ctx, layerContainer: instance },
    };
  }
);

export default MarkerClusterGroup;