import classNames from "classnames";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { createPortal } from "react-dom";
import { TableColumn, TableContextType } from "../types";
import Popover from "./Popover";
import Icon from "./Icon";
import Input from "./Input";
import Button from "./Button";
import Skleton from "./Skleton";
import Spinner from "./Spinner";

const TableContext = createContext<TableContextType | undefined>(undefined);

export const useTableContext = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTableContext must be used within a TableProvider");
  }
  return context;
};

type TableRootProps = {
  children: React.ReactNode;
  defaultColumnConfig: TableColumn[];
  columnConfig: TableColumn[];
  updateConfig?: (val: TableColumn[]) => void;
  updateWidths?: (val: number[]) => void;
  columnWidths: number[] | string[];
  columnControl?: boolean;
};

const TableRoot: React.FC<TableRootProps> = ({
  children,
  defaultColumnConfig,
  columnConfig,
  columnWidths,
  updateConfig,
  updateWidths,
  columnControl,
}) => {
  const [moveIndex, setMoveIndex] = useState<number>(-1);
  const [hoverIndex, setHoverIndex] = useState<number>(-1);
  const [showColumnControl, setShowColumnControl] = useState<number>(-1);
  const [enterColumnControl, setEnterColumnControl] = useState(false);
  const [showShadow, setShowShadow] = useState(false);
  const [visibleIndex, setVisibleIndex] = useState<number>(-1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [openPopover, setOpenPopover] = useState(false);

  // Handle horizontal scroll for shadow effect
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    const handleScroll = () => {
      if (scrollContainer) {
        setShowShadow(scrollContainer.scrollLeft > 0);
      }
    };

    scrollContainer?.addEventListener("scroll", handleScroll);
    return () => scrollContainer?.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowColumnControl(-1);
      setOpenPopover(false);
      setEnterColumnControl(false);
    }, 900);

    if (showColumnControl !== -1) timer;

    if (openPopover) clearTimeout(timer);

    if (enterColumnControl) clearTimeout(timer);

    return () => clearTimeout(timer);
  }, [showColumnControl, openPopover, enterColumnControl]);

  return (
    <DndProvider backend={HTML5Backend}>
      <TableContext.Provider
        value={{
          moveIndex,
          setMoveIndex,
          showShadow,
          columnConfig,
          updateConfig,
          columnWidths,
          updateWidths,
          defaultColumnConfig,
          hoverIndex,
          setHoverIndex,
          setShowColumnControl,
          showColumnControl,
          setVisibleIndex,
          visibleIndex,
          openPopover,
          setOpenPopover,
          columnControl,
          enterColumnControl,
          setEnterColumnControl,
        }}
      >
        <div
          ref={scrollContainerRef}
          className={classNames(
            "dynamic-table-container overflow-x-auto h-full"
          )}
        >
          {children}
        </div>
      </TableContext.Provider>
    </DndProvider>
  );
};

const ColumnControlHeader: React.FC = () => {
  const { updateConfig, columnConfig, defaultColumnConfig, columnWidths } =
    useTableContext();
  const [search, setSearch] = useState<string>();
  const [openPopover, setOpenPopover] = useState(false);

  const handleToggle = (index: number) => {
    setOpenPopover(false);
    const clone = structuredClone(columnConfig);
    const findIndex = clone.findIndex((elm) => elm.index === index);
    clone[findIndex].visibility = true;
    updateConfig && updateConfig(clone);
  };

  const filterColumn = useMemo(() => {
    if (!search) return columnConfig.filter((elm) => !elm.visibility);
    else
      return columnConfig.filter(
        (elm) =>
          elm.title.toLowerCase().includes(search.toLowerCase()) &&
          !elm.visibility
      );
  }, [search, columnConfig]);

  const handleReset = () => {
    setOpenPopover(false);
    const clone = defaultColumnConfig.map((elm) => ({
      ...elm,
      widths: columnWidths[elm.index],
    }));
    updateConfig && updateConfig(clone);
  };

  return (
    <div className="my-1 mx-2 flex-1">
      <Popover
        open={openPopover}
        onOpenChange={() => setOpenPopover((pre) => !pre)}
        placement="bottom"
        content={
          <div className="px-5 py-2 w-96 flex flex-col gap-2">
            <div className="flex py-3">
              <h3 className="font-semibold">Add columns</h3>
              <div className="flex-1" />
              <div
                className="w-6 h-6 cursor-pointer"
                onClick={() => setOpenPopover(false)}
              >
                <Icon iconName="close" className="w-6 h-6 cursor-pointer" />
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex-1">
                <Input
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                />
              </div>
              {!!filterColumn.length && (
                <div className="flex gap-6 flex-col">
                  <p className="text-gray-600 text-sm">
                    Select attribute to add and re-order on the right.
                  </p>
                  <div className="flex flex-col max-h-[350px] overflow-auto items-center gap-3 border-b pb-2">
                    {filterColumn.map(({ index, title }) => (
                      <div
                        className="border rounded-[8px] p-3 w-full flex cursor-pointer"
                        key={`${index}_${title}`}
                        onClick={() => {
                          handleToggle(index);
                        }}
                      >
                        <span className="text-sm">{title}</span>
                        <div className="flex-1" />
                        <Icon iconName={"plus"} className="w-4 h-4" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!filterColumn.length && (
                <div className="h-[320px] flex flex-col gap-6 items-center w-full">
                  <p className="text-gray-600">
                    You are seeing all the attributes
                  </p>
                </div>
              )}
            </div>
            <div className="">
              <Button onClick={handleReset} size="sm" variant="text">
                Reset to default
              </Button>
            </div>
          </div>
        }
        trigger={
          <div className="w-8 h-8 rounded bg-white flex items-center justify-center cursor-pointer">
            <Icon iconName="plus" className="w-5 h-5" />
          </div>
        }
      ></Popover>
    </div>
  );
};

const ColumnControlPopover: React.FC = () => {
  const {
    updateConfig,
    columnConfig,
    defaultColumnConfig,
    columnWidths,
    showColumnControl,
    openPopover,
    setOpenPopover,
    setEnterColumnControl,
    setShowColumnControl,
  } = useTableContext();
  const [search, setSearch] = useState<string>();

  const handleMoveToggle = (index: number) => {
    setOpenPopover(false);
    setEnterColumnControl(false);
    const clone = structuredClone(columnConfig);
    const findIndex = clone.findIndex((elm) => elm.index === index);
    clone[findIndex].visibility = true;
    const [move] = clone.splice(findIndex, 1);
    const startIndex = clone.findIndex(
      (elm) => elm.index === showColumnControl
    );
    clone.splice(startIndex + 1, 0, move);
    updateConfig && updateConfig(clone);
  };

  const filterColumn = useMemo(() => {
    if (!search) return columnConfig.filter((elm) => !elm.visibility);
    else
      return columnConfig.filter(
        (elm) =>
          elm.title.toLowerCase().includes(search.toLowerCase()) &&
          !elm.visibility
      );
  }, [search, columnConfig]);

  const handleReset = () => {
    setOpenPopover(false);
    setEnterColumnControl(false);
    const clone = defaultColumnConfig.map((elm) => ({
      ...elm,
      widths: columnWidths[elm.index],
    }));
    updateConfig && updateConfig(clone);
  };

  return (
    <Popover
      open={openPopover}
      onOpenChange={() => {
        setOpenPopover((pre) => !pre);
        setEnterColumnControl((pre) => !pre);
      }}
      placement="bottom"
      content={
        <div className="px-5 py-2 w-96 flex flex-col gap-2">
          <div className="flex py-3">
            <h3 className="font-semibold">Add columns</h3>
            <div className="flex-1" />

            <div
              className="w-6 h-6 cursor-pointer"
              onClick={() => setOpenPopover(false)}
            >
              <Icon iconName="close" className="w-6 h-6 cursor-pointer" />
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex-1">
              <Input
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
            </div>
            {!!filterColumn.length && (
              <div className="flex gap-6 flex-col">
                <p className="text-gray-600 text-sm">
                  Select attribute to add and re-order on the right.
                </p>
                <div className="flex flex-col max-h-[350px] overflow-auto items-center gap-3 border-b pb-2">
                  {filterColumn.map(({ index, title }) => (
                    <div
                      className="border rounded-[8px] p-3 w-full flex cursor-pointer"
                      key={`${index}_${title}`}
                      onClick={() => handleMoveToggle(index)}
                    >
                      <span className="text-sm">{title}</span>
                      <div className="flex-1" />
                      <Icon iconName={"plus"} className="w-4 h-4" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!filterColumn.length && (
              <div className="h-[320px] flex flex-col gap-6 items-center w-full">
                <p className="text-gray-600">
                  You are seeing all the attributes
                </p>
              </div>
            )}
          </div>
          <div className="">
            <Button
              onClick={handleReset}
              size="sm"
              className="text-blue-600"
              variant="text"
            >
              Reset to default
            </Button>
          </div>
        </div>
      }
      trigger={
        <div
          onMouseEnter={() => setEnterColumnControl(true)}
          onMouseLeave={() => {
            if (!openPopover) {
              setEnterColumnControl(false);
              setShowColumnControl(-1);
            }
          }}
          className="w-8 h-8 rounded-[4px] bg-white flex items-center justify-center cursor-pointer"
        >
          <Icon iconName="plus" className="w-5 h-5" />
        </div>
      }
    ></Popover>
  );
};

const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showShadow } = useTableContext();

  return (
    <div
      className={classNames("flex bg-gray-50 sticky top-0 z-20 w-full", {
        "!w-fit": showShadow,
      })}
    >
      {children}
    </div>
  );
};

const TableBody: React.FC<{
  children: React.ReactNode;
  isLoading?: boolean;
  skeletonLength?: number;
}> = ({ children, isLoading, skeletonLength = 25 }) => {
  const { columnConfig, showShadow } = useTableContext();
  if (isLoading)
    return Array.from({ length: skeletonLength }).map((_, index) => (
      <TableRowBody key={index}>
        {Array.from({ length: columnConfig.length }).map((_, index) => (
          <TableCell
            index={columnConfig[index].index}
            name={columnConfig[index].title}
            key={index}
          >
            <Skleton className="w-full h-[25px]" />
          </TableCell>
        ))}
      </TableRowBody>
    ));
  return <div className={classNames({ "w-fit": showShadow })}>{children}</div>;
};

interface TableRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const TableRowHeader: React.FC<TableRowProps> = ({
  children,
  className = "",
  ...rest
}) => {
  const { columnControl } = useTableContext();
  return (
    <div
      className={`flex w-full h-[42px] border-b group ${className}`}
      {...rest}
    >
      {children}
      {columnControl && <ColumnControlHeader />}
    </div>
  );
};
const TableRowBody: React.FC<TableRowProps> = ({
  children,
  className = "",
  ...rest
}) => {
  const { columnControl } = useTableContext();
  return (
    <div
      className={`flex w-full h-[42px] border-b group ${className}`}
      {...rest}
    >
      {children}
      {columnControl && <div className="w-[42px] order-last"></div>}
    </div>
  );
};

const TableColumnHeader: React.FC<{
  children: React.ReactNode;
  index?: number;
  name: string;
  className?: string;
  hasAction?: boolean;
  moveable?: boolean;
  hasColumnControl?: boolean;
}> = ({
  children,
  index,
  className = "",
  hasAction = false,
  name,
  moveable = true,
  hasColumnControl = true,
}) => {
  const {
    moveIndex,
    setMoveIndex,
    showShadow,
    columnConfig,
    columnWidths,
    updateWidths,
    setHoverIndex,
    setShowColumnControl,
    showColumnControl,
    hoverIndex,
    setVisibleIndex,
    setOpenPopover,
  } = useTableContext();
  const targetRef = React.useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (index === undefined) return;

    const startX = e.clientX;
    const startWidth = Number(columnConfig[index].widths);
    setHoverIndex(-1);
    setMoveIndex(index);

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(startWidth + moveEvent.clientX - startX, 50);
      const updatedWidths = [...columnWidths] as number[]; // Ensure it's a number array
      updatedWidths[index] = newWidth;
      if (updatedWidths.some((width) => typeof width !== "number"))
        return; // Validate array
      else updateWidths && updateWidths(updatedWidths);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      setMoveIndex(-1);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  if (
    index !== undefined &&
    !columnConfig.find((elm) => elm.title === name)?.visibility
  )
    return null;

  return (
    <div
      ref={targetRef}
      id={`columnHeader`}
      onMouseEnter={() => {
        if (index !== undefined) setShowColumnControl(index);
        else {
          setShowColumnControl(-1);
        }
      }}
      className={classNames(
        `${className} group flex-shrink-0 relative flex items-center justify-between ps-3 pe-2 py-[8px] border-e`,
        {
          "border-e-gray-300 !bg-gray-100": moveIndex === index,
          "sticky left-0 bg-gray-50 z-20 table-first-field": index === 0,
          "border-e-gray-300 !bg-gray-50": hoverIndex === index,
        }
      )}
      style={{
        width:
          typeof columnWidths[index || 0] === "number"
            ? `${columnWidths[index || 0]}px`
            : columnWidths[index || 0],
      }}
    >
      <div
        onMouseEnter={() => {
          if (index !== undefined) setVisibleIndex(index);
        }}
        onMouseLeave={() => setVisibleIndex(-1)}
        className={classNames(
          "w-full text-gray-700 !text-[12px] py-1  flex items-center ps-3 pe-1 rounded-[4px]",
          {
            "hover:bg-gray-100": hasAction,
          }
        )}
      >
        {children}
      </div>
      {index !== undefined && moveable && (
        <div
          onMouseEnter={() => {
            if (index !== moveIndex) setHoverIndex(index);
            setShowColumnControl(-1);
            setOpenPopover(false);
          }}
          onMouseLeave={() => setHoverIndex(-1)}
          className={classNames(
            "absolute hover:bg-gray-100 right-0 top-0 h-full cursor-col-resize w-1",
            { "bg-gray-100": showColumnControl === index }
          )}
          onMouseDown={handleMouseDown}
        />
      )}
      {index === 0 && showShadow && (
        <div
          className={`absolute h-full right-[1px] top-0 bg-transparent  w-[1px]`}
        ></div>
      )}
      {showColumnControl === index && hasColumnControl && (
        <PortalAbove targetRef={targetRef}>
          <ColumnControlPopover />
        </PortalAbove>
      )}
    </div>
  );
};

const TableColumnHeaderAction: React.FC<{
  index: number;
  removeable?: boolean;
  lists?: {
    loading?: boolean;
    disable?: boolean;
    title: ReactNode;
    icon?: string;
    fill?: string;
    id: string;
    className?: string;
    visible?: boolean;
    onClick?: (id: string, selectedItem?: any) => void;
  }[];
}> = ({ index, lists, removeable = true }) => {
  const { visibleIndex, columnConfig, updateConfig, setVisibleIndex } =
    useTableContext();
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(false);
    setVisibleIndex(-1);
    const clone = structuredClone(columnConfig);
    const findIndex = clone.findIndex((elm) => elm.index === index);
    clone[findIndex].visibility = false;
    updateConfig && updateConfig(clone);
  };
  if (!removeable && !lists?.length) return <></>;
  return (
    <div
      className={classNames("invisible absolute right-4", {
        "!visible": visibleIndex === index || open,
      })}
    >
      <Popover
        open={open}
        onOpenChange={() => setOpen((pre) => !pre)}
        placement="bottom"
        trigger={
          <div className={`p-1 bg-white rounded-[4px]  cursor-pointer`}>
            <Icon className="w-4 h-4" iconName="dotsHorizontalRounded" />
          </div>
        }
        content={
          <div className="px-5 py-2 w-96 flex flex-col gap-2">
            {lists
              ?.filter((item) => item.visible !== false)
              ?.map((list) => (
                <div
                  onClick={() => {
                    if (list.disable || list.loading) return;
                    list?.onClick?.(list.id);
                    setOpen(false);
                  }}
                  key={list.id}
                  className={classNames(
                    "p-3 cursor-pointer flex gap-2 hover:bg-gray-50",
                    {
                      "opacity-30 !cursor-not-allowed":
                        list.disable || list.loading,
                    }
                  )}
                >
                  {list.icon && (
                    <Icon className={list.className} iconName={list.icon} />
                  )}
                  <p>{list.title}</p>
                  {!list.disable && !!list.loading && (
                    <div className={"flex-shrink-0"}>
                      <Spinner className={"w-4 h-4"} />
                    </div>
                  )}
                </div>
              ))}
            {removeable && (
              <div
                onClick={handleToggle}
                className="p-3 cursor-pointer flex gap-2 hover:bg-gray-50"
              >
                <Icon className="w-4 h-4" iconName="minus" />
                <p className="text-red-600">Remove from table</p>
              </div>
            )}
          </div>
        }
      ></Popover>
    </div>
  );
};

interface TableCellProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  justify?: "start" | "center" | "end";
  index?: number;
  name: string;
  className?: string;
}

const TableCell: React.FC<TableCellProps> = ({
  children,
  justify = "start",
  index,
  className = "",
  name,
  ...rest
}) => {
  const { columnConfig, columnWidths, showShadow, moveIndex, hoverIndex } =
    useTableContext();

  if (
    index !== undefined &&
    !columnConfig.find((elm) => elm.title === name)?.visibility
  )
    return null;

  return (
    <div
      {...rest}
      className={classNames(
        `${className} flex flex-shrink-0 px-6 py-0 items-center border-e text-gray-700 group-hover:!bg-gray-50`,
        {
          [`justify-${justify}`]: justify,
          "sticky left-0 bg-white z-10": index === 0,
          "border-e-gray-300 !bg-gray-100": moveIndex === index,
          "border-e-gray-300 !bg-gray-50": hoverIndex === index,
          "table-first-field": index === 0,
        }
      )}
      style={{
        width:
          typeof columnWidths[index || 0] === "number"
            ? `${columnWidths[index || 0]}px`
            : columnWidths[index || 0],
        order: columnConfig.findIndex((elm) => elm.title === name),
      }}
    >
      {children}
      {index === 0 && showShadow && (
        <div
          className={`absolute h-full right-[1px] top-0 bg-transparent  w-[1px]`}
        ></div>
      )}
    </div>
  );
};

interface PortalAboveProps {
  targetRef: React.RefObject<HTMLElement>;
  children: React.ReactNode;
}

function PortalAbove({
  targetRef,
  children,
}: PortalAboveProps): React.ReactPortal | null {
  const [style, setStyle] = React.useState<React.CSSProperties | null>(null);

  useEffect(() => {
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      setStyle({
        position: "absolute",
        top: rect.top - 38, // Adjust to position the portal above the target
        left: rect.right - 15,
        zIndex: 1000, // Ensure it appears above other elements
      });
    }
  }, [targetRef]);

  if (!style) return null;

  return createPortal(
    <div style={style} className="shadow rounded">
      {children}
    </div>,
    document.body
  ) as React.ReactPortal;
}

const DRAG_TYPE = "COLUMN";

function DraggableColumnHeader({
  index,
  moveColumn,
  children,
  canDrag = true,
}: {
  moveColumn: (fromIndex: number, toIndex: number) => void;
  children: React.ReactNode;
  index: number;
  canDrag?: boolean;
}) {
  const { moveIndex } = useTableContext();
  const [, dragRef] = useDrag({
    type: DRAG_TYPE,
    item: { index },
    canDrag: moveIndex === -1,
  });

  const [, dropRef] = useDrop({
    accept: DRAG_TYPE,
    drop(draggedItem: any) {
      if (draggedItem.index !== index) {
        moveColumn(draggedItem.index, index);
        draggedItem.index = index; // Update the dragged item’s index
      }
    },
  });

  if (!canDrag) return <>{children}</>;

  return (
    <div ref={(node) => dragRef(dropRef(node))} className="h-[42px] flex">
      {children}
    </div>
  );
}

// Export components as part of the Table kit
export const Table = {
  Root: TableRoot,
  Header: TableHeader,
  Body: TableBody,
  RowHeader: TableRowHeader,
  RowBody: TableRowBody,
  ColumnHeader: TableColumnHeader,
  Cell: TableCell,
  Draggable: DraggableColumnHeader,
  ColumnHeaderAction: TableColumnHeaderAction,
};
