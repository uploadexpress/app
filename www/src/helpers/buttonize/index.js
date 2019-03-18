const buttonize = handlerFn => ({
  role: 'button',
  onClick: handlerFn,
  onKeyDown: (event) => {
    if (event.keycode === 13) handlerFn(event);
  },
});

export default buttonize;
