import React from "react";

interface LanguageSelectProps {
  value: string | undefined;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  languages: string[];
}

const LanguageSelect: React.FC<LanguageSelectProps> = ({
  value,
  onChange,
  languages,
}) => {
  const minWidth = 4; // 最小宽度为 4em
  const width = value
    ? `${Math.max(value.length/2 + 4, minWidth)}em`
    : `${minWidth}em`;

  return (
    <select
      className="border border-gray-300 text-gray-500 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      contentEditable={false}
      style={{ width }}
      value={value}
      onChange={onChange}
    >
      <option className="text-gray-500" value="null">
        auto
      </option>
      <option className="text-gray-500" disabled>
        —
      </option>
      {languages.map((lang, index) => (
        <option key={index} value={lang}>
          {lang}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelect;
