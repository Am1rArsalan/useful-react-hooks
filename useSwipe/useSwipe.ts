import { useReducer } from "react";

const START_TOUCH = "START_TOUCH";
const TOUCH = "TOUCH";
const END_TOUCH = "END_TOUCH";


const initState = {
  startPosition: {
    x: 0,
    y: 0,
  },

  currentPosition: {
    x: 0,
    y: 0,
  },
  relocationRate: 65,
  touch: false,
};

function reducer(state, action) {
  switch (action.type) {
    case START_TOUCH:
      return {
        ...state,
        startPosition: { ...action.payload },
        touch: true,
      };

    case END_TOUCH:
      return {
        ...state,
        relocationRate: 65,
        touch: false,
      };

    case TOUCH:
      return {
        ...state,
        currentPosition: { ...action.payload },
        relocationRate: 100,
      };

    default:
      return state;
  }
}

function useSwipe() {
  const [state, dispatch] = useReducer(reducer, initState);

  function handleStart(e) {
    if (typeof e["targetTouches"] !== "undefined") {
      const touch = e.targetTouches[0];
      dispatch({
        type: START_TOUCH,
        payload: { x: touch?.clientX, y: touch?.clientY },
      });
    } else {
      dispatch({
        type: START_TOUCH,
        payload: { x: e?.clientX, y: e?.clientY },
      });
    }
  }

  function handleEnd(e) {
    if (document.body.scrollTop === 0) {
      dispatch({
        type: "END_TOUCH",
      });
    }
  }

  function calculateYDiff(currentY, startY) {
    return currentY - startY >= 4;
  }

  function handleMove(e) {
    if (!state.touch) return;
    if (typeof e["changedTouches"] !== "undefined") {
      const touch = e.changedTouches[0];
      calculateYDiff(touch?.clientY, state?.startPosition?.y) &&
        dispatch({
          type: TOUCH,
          payload: { x: touch?.clientX, y: touch?.clientY },
        });
    } else {
      calculateYDiff(touch?.clientY, state?.startPosition?.y) &&
        dispatch({
          type: TOUCH,
          payload: { x: e?.clientX, y: e?.clientY },
        });
    }

    let changeY =
      state.startPosition.y < state.currentPosition.y
        ? Math.abs(state.startPosition.y - state.currentPosition.y)
        : 0;

    // const rotation = changeY < 100 ? changeY * 30 / 100 : 30;
    // if (document.body.scrollTop === 0) {
    //   if (changeY > 100) loading();
    // }
  }

  return {
    handleMove,
    handleEnd,
    handleStart,
    relocationRate: state.relocationRate,
  };
}

export default useSwipe;