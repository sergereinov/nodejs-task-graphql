export const validatePatchBody = <T extends object>(body: T, props: string[]): boolean => {
  const properties = Object.keys(body);

  return !!properties.length && properties.every((prop) => props.includes(prop));
}
