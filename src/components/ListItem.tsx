import React from "react";

const ListItem: React.FC<{ item: { name: string | null; time: Date } }> = ({
  item,
}) => {
  return (
    <li>
      <p>Name: {item.name}</p>
      <p>Time: {item.time.toLocaleString()}</p>
    </li>
  );
};

export default ListItem;
