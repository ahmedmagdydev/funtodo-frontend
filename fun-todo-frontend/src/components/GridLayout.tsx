import React, { useMemo } from "react";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Box } from "@mui/material";
import { SensorData } from "../types/dashboard";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface GridLayoutProps {
  items: SensorData[];
  renderItem: (item: SensorData) => React.ReactNode;
  onLayoutChange: (layout: Layout[]) => void;
  savedLayout?: Layout[];
  itemWidth?: number;
  itemHeight?: number;
  totalCols?: number;
}

export const GridLayout: React.FC<GridLayoutProps> = ({
  items,
  renderItem,
  onLayoutChange,
  savedLayout,
  itemWidth = 4,
  itemHeight = 6,
  totalCols = 12,
}) => {
  // Calculate items per row based on total columns and item width
  const itemsPerRow = Math.floor(totalCols / itemWidth);
  // Generate layout with unique IDs for each item
  const layouts = useMemo(() => {
    const generateDefaultLayout = (): Layout[] => {
      return items.map((item, i) => ({
        i: `${item.clientId}-${item.type}`,
        x: (i % itemsPerRow) * itemWidth,
        y: Math.floor(i / itemsPerRow) * itemHeight,
        w: itemWidth,
        h: itemHeight,
        minW: Math.max(3, itemWidth - 1),
  
        minH: itemHeight,
        static: false,
      }));
    };

    const createLayout = (): Layout[] => {
      if (!savedLayout) return generateDefaultLayout();

      const currentIds = new Set(items.map(item => `${item.clientId}-${item.type}`));
      const validSavedLayouts = savedLayout.filter(layout => currentIds.has(layout.i));
      
      const newItems = items.filter(item => 
        !savedLayout.some(layout => layout.i === `${item.clientId}-${item.type}`)
      );

      const lastY = Math.max(...validSavedLayouts.map(l => l.y), -1);
      const startY = lastY + itemHeight;

      const newLayouts = newItems.map((item, i) => ({
        i: `${item.clientId}-${item.type}`,
        x: (i % itemsPerRow) * itemWidth,
        y: startY + Math.floor(i / itemsPerRow) * itemHeight,
        w: itemWidth,
        h: itemHeight,
        minW: Math.max(3, itemWidth - 1),
      
        minH: itemHeight,
        static: false,
      }));
      return [...validSavedLayouts, ...newLayouts];
    };

    // Calculate responsive layouts
    const mdItemWidth = Math.min(itemWidth * 1.5, totalCols / 2);
    const smItemWidth = totalCols;

    return {
      lg: createLayout(),
      md: createLayout().map(layout => ({
        ...layout,
        w: mdItemWidth,
        x: (layout.y * 2) % (totalCols - mdItemWidth + 1),
      })),
      sm: createLayout().map(layout => ({
        ...layout,
        w: smItemWidth,
        x: 0,
      })),
    };
  }, [items, savedLayout, itemWidth, itemHeight, totalCols, itemsPerRow]);
     
  return (
    <Box sx={{ width: "100%", minHeight: "400px" }}>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}

        rowHeight={80}
        onLayoutChange={(_, allLayouts) => onLayoutChange(allLayouts.lg)}
        isDraggable
        isResizable
        margin={[10, 10]}
        containerPadding={[5, 5]}
        compactType="horizontal"
      >
        {items.map((item) => (
          <div key={`${item.clientId}-${item.type}`} style={{ height: '100%' }}>
            {renderItem(item)}
          </div>
        ))}
      </ResponsiveGridLayout>
    </Box>
  );
};
