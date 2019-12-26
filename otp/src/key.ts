import "mousetrap";

export let EnterKey = "enter";

export const resetEnterKey = () => (EnterKey = "enter");

Mousetrap.bind(["command+enter", "ctrl+enter"], (e, c) => {
  EnterKey = "command";
});

Mousetrap.bind(["option+enter", "alt+enter"], (e, c) => {
  EnterKey = "option";
});
