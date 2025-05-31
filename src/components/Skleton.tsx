import classNames from "classnames";

const Skleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={classNames(
        `animate-pulse bg-gray-100 rounded flex flex-col`,
        className
      )}
    >
      <div className="flex items-center mt-5">
        <div>
          <div className={`rounded-full bg-gray-200`} />
        </div>
      </div>
    </div>
  );
};

export default Skleton;
