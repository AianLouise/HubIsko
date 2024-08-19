import React from 'react';

const PageHeader = ({ path }) => {
  return (
    <h1 className="text-lg font-bold text-blue-500">{path}</h1>
  );
};

export default PageHeader;