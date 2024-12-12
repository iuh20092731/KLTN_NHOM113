import unidecode from "unidecode";

export const formatLink = (name: string) => {
    const lowerCaseName = name.toLowerCase();
    const noAccentName = unidecode(lowerCaseName);
    const formattedName = noAccentName
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9-]/g, "");
    return formattedName;
  };