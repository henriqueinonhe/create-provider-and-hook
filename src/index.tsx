import { ReactNode, createContext, useContext } from "react";

/**
 * Implements React Provider Pattern.
 *
 * Takes care of the boilerplate of creating the context,
 * the provider and the hook, while also checking for the
 * provider presence.
 */
export const createProviderAndHook =
  <Name extends string>(name: ValidateIsPascalCase<Name>) =>
  <ContextValue,>() => {
    const isPascalCase = pascalCaseRegex.test(name as Name);

    if (!isPascalCase) {
      throw new Error(
        `createProviderHook only works for PascalCase names. "${name}" is NOT PascalCase!`,
      );
    }

    const Context = createContext<ContextValue | undefined>(undefined);

    type ProviderProps = {
      children: ReactNode;
      value: ContextValue;
    };

    const providerName = `${name}Provider`;
    const hookName = `use${name}`;

    const Provider = ({ children, value }: ProviderProps) => {
      return <Context.Provider value={value}>{children}</Context.Provider>;
    };

    const useProvider = () => {
      const value = useContext(Context);

      if (!value) {
        throw new Error(
          `Cannot call ${hookName} without a ${providerName} higher up in te component tree!`,
        );
      }

      return value;
    };

    type CreateProviderAndHookReturnValue = Record<
      `${Name}Provider`,
      typeof Provider
    > &
      Record<`use${Name}`, typeof useProvider>;

    return {
      [providerName]: Provider,
      [hookName]: useProvider,
    } as CreateProviderAndHookReturnValue;
  };

const pascalCaseRegex = /^[A-Z]([A-z0-9])*$/;

type ValidateIsPascalCase<Name extends string> =
  IsValidPascalCase<Name> extends true
    ? Name
    : {
        error: `createProviderHook only works for PascalCase names. "${Name}" is NOT PascalCase!`;
        _brand: never;
      };

type IsValidPascalCase<Name extends string> =
  Name extends `${infer Head}${infer Tail}`
    ? And<
        IsValidPascalCaseFirstLetter<Head>,
        IsValidPascalCaseSegmentAfterFirstLetter<Tail>
      >
    : false;

type And<L extends boolean, R extends boolean> = L extends true
  ? R extends true
    ? true
    : false
  : false;

type IsValidPascalCaseFirstLetter<Name extends string> =
  Name extends PascalCaseFirstLetter ? true : false;

type IsValidPascalCaseSegmentAfterFirstLetter<Name extends string> =
  Name extends ""
    ? true
    : Name extends `${infer Head}${infer Tail}`
      ? Head extends PascalCaseNonFirstLetter
        ? IsValidPascalCaseSegmentAfterFirstLetter<Tail>
        : false
      : false;

type PascalCaseFirstLetter = UpperCaseLetter;

type PascalCaseNonFirstLetter = UpperCaseLetter | LowerCaseLetter | Digit;

type UpperCaseLetter =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "Y"
  | "X"
  | "Z";

type LowerCaseLetter =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "y"
  | "x"
  | "z";

type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
