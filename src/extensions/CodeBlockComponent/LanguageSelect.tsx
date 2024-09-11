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
    ? `${Math.max(value.length / 2 + 4, minWidth)}em`
    : `${minWidth}em`;

  return (
    <select
      className="appearance-none border-none text-gray-500 bg-transparent rounded-md px-3 py-2 text-sm focus:outline-none cursor-pointer"
      contentEditable={false}
      style={{ width, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
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
