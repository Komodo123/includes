export const WILDCARD = "*";
export const NEGATION = "-";

export type Wildcard = typeof WILDCARD;
export type Negation = typeof NEGATION;

export type Primitive = bigint | boolean | null | number | string | undefined;

export type Pattern<T extends Primitive> =
  | Wildcard
  | `${Negation}${Wildcard}`
  | `${Negation}${T}`
  | T
  | RegExp
  | (Wildcard | T | RegExp)[];

export type IncludeOptions = {
  allowWildNeedle?: boolean;
  allowWildHaystack?: boolean;
};

export function includes<T extends Primitive>(
  needle: Pattern<T>,
  haystack: Pattern<T>,
  options: IncludeOptions = {
    allowWildNeedle: true,
    allowWildHaystack: true,
  }
): boolean {
  needle = coerce(needle);
  haystack = coerce(haystack);

  if (Array.isArray(needle)) {
    // e.x. needle [], haystack = "*"
    if (
      haystack === WILDCARD &&
      options.allowWildHaystack &&
      needle.length <= 0
    ) {
      return true;
    }

    for (const item of needle) {
      if (!includes(item, haystack, options)) {
        return false;
      }
    }

    return true;
  } else if (Array.isArray(haystack)) {
    // e.x. needle = "*", haystack = []
    if (
      needle === WILDCARD &&
      options.allowWildNeedle &&
      haystack.length <= 0
    ) {
      return true;
    }

    for (const pattern of haystack) {
      if (typeof pattern === "string") {
        if (
          pattern[0] === NEGATION &&
          includes(needle, <Pattern<T>>pattern.substring(1), options)
        ) {
          return false;
        }
      }
    }

    for (const pattern of haystack) {
      if (includes(needle, pattern, options)) {
        return true;
      }
    }
  } else if (haystack === WILDCARD && options.allowWildHaystack) {
    return true;
  } else if (
    needle === WILDCARD &&
    options.allowWildNeedle &&
    haystack !== NEGATION + WILDCARD
  ) {
    return true;
  } else if (haystack === NEGATION + WILDCARD) {
    return false;
  }

  if (haystack instanceof RegExp) {
    return haystack.test(`${needle}`);
  }

  if (needle instanceof RegExp) {
    return needle.test(`${haystack}`);
  }

  return haystack === needle;
}

function coerce<T extends Primitive>(pattern: Pattern<T>): Pattern<T> {
  if (Array.isArray(pattern)) {
    pattern = <[]>pattern.map(coerce);
  } else if (typeof pattern === "string") {
    if (pattern.indexOf("*") !== -1 && pattern.indexOf("-") !== 0) {
      let intermediate;

      intermediate = pattern.replaceAll("*", ".*");
      intermediate = new RegExp(`^${intermediate}$`);

      pattern = intermediate;
    }
  }

  return pattern;
}
