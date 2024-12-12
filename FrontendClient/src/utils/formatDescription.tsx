import React from 'react';

const TextWithLineBreaks: React.FC<string> = (text: string) => {
  const lines = text.split('$');

  return (
    <div>
      {lines.map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default TextWithLineBreaks;
