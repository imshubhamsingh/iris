import React, {
  useReducer,
  useEffect,
  useMemo,
  useState,
  FormEventHandler,
} from 'react';

import { Input } from '../../Input/Input';

import { reducer, init } from '../Calendar/Calendar.state';
import { initialState } from '../Calendar/Calendar.types';
import { Props } from './DateRange.types';
import { getDateFormat, formatDate } from './DateFormat';
import { Calendar } from '../Calendar/Calendar';

import {
  ApplyButton,
  CalendarHeader,
  CalendarsBody,
  CalendarsContainer,
  CalendarsFooter,
  ClearButton,
  DateField,
  DateRangeContainer,
  Menu,
} from './DateRange.style';

import { slate } from '../../../../color';
import { withIris } from '../../../../utils';

export const DateRange = withIris<HTMLInputElement, Props>(
  DateRangeComponent,
);

const dateFormat = getDateFormat();

function DateRangeComponent({
  className,
  onChange,
  minDate,
  maxDate,
  startInputLabel = 'Start date',
  endInputLabel = 'End date',
  presets,
}: Props) {
  const [state, dispatch] = useReducer(reducer, initialState, init);
  const [presetOption, setPresetOption] = useState('');

  // When our internal range value changes, if a callback for onChange is passed
  // let's call that callback with our new value.
  useEffect(() => {
    if (onChange) {
      onChange(state.range);
    }
  }, [state.range, onChange]);

  const {
    startLabel,
    startDateError,
    endLabel,
    endDateError,
    range: [rangeStart, rangeEnd],
    draft: [draftStart, draftEnd],
    hoverDraft: [hoverStart, hoverEnd],
    viewportDate,
    open,
  } = state;

  // Get the viewport for the second calendar in our range picker.
  const nextViewportDate = useMemo(() => {
    const year = viewportDate.getFullYear();
    const month = viewportDate.getMonth();
    const nextDate = new Date();

    nextDate.setFullYear(year, month + 1, 1);

    return nextDate;
  }, [viewportDate]);

  // Derive the value for the input that represents our start date.
  const startDateLabel = useMemo(() => {
    if (typeof startLabel === 'string') {
      return startLabel;
    }

    if (hoverStart) {
      return formatDate(hoverStart);
    }

    if (draftStart) {
      return formatDate(draftStart);
    }

    if (!open && rangeStart) {
      return formatDate(rangeStart);
    }

    return '';
  }, [open, draftStart, startLabel, hoverStart, rangeStart]);

  // Derive the value for the input that represents our end date.
  const endDateLabel = useMemo(() => {
    if (typeof endLabel === 'string') {
      return endLabel;
    }

    if (hoverEnd) {
      return formatDate(hoverEnd);
    }

    if (draftEnd) {
      return formatDate(draftEnd);
    }

    if (!open && rangeEnd) {
      return formatDate(rangeEnd);
    }

    return '';
  }, [open, draftEnd, endLabel, hoverEnd, rangeEnd]);

  // Callback for going to the next month in our date range picker.
  function handleGoForward() {
    const { viewportDate } = state;
    const payload = new Date(
      viewportDate.getFullYear(),
      viewportDate.getMonth() + 1,
      1,
    );
    dispatch({ type: 'CHANGE_VIEWPORT', payload });
  }

  // Callback for going to the previous month in our date range picker.
  function handleGoBackward() {
    const { viewportDate } = state;
    const payload = new Date(
      viewportDate.getFullYear(),
      viewportDate.getMonth() - 1,
      1,
    );
    dispatch({ type: 'CHANGE_VIEWPORT', payload });
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    event.stopPropagation();
    switch (event.key) {
      case 'Enter':
        if (open) {
          dispatch({ type: 'SAVE' });
        } else {
          dispatch({ type: 'OPEN' });
        }
        break;
      case 'Escape':
        if (open) {
          dispatch({ type: 'CLOSE' });
        }
        break;
      default:
    }
  }

  function handleClick(payload) {
    dispatch({ type: 'SELECT_DATE', payload });
  }

  function handleHover(payload) {
    dispatch({ type: 'HOVER_DATE', payload });
  }

  const handleStartChange: FormEventHandler<HTMLInputElement> = event => {
    dispatch({
      type: 'CHANGE_START',
      payload: {
        label: event.currentTarget.value,
        minDate,
      },
    });
  };

  const handleEndChange: FormEventHandler<HTMLInputElement> = event => {
    dispatch({
      type: 'CHANGE_END',
      payload: {
        label: event.currentTarget.value,
        maxDate,
      },
    });
  };

  const handleSelectPreset = preset => {
    const payload = [];
    const currentDate = new Date();

    setPresetOption(preset);
    dispatch({ type: 'CLEAR' });

    switch (typeof preset) {
      case 'string':
        if (preset === 'today') {
          payload.push(currentDate);
        }
        break;
      case 'number':
        const date = new Date(
          new Date().setDate(new Date().getDate() + preset),
        );
        if (preset > 0) {
          payload.push(currentDate);
          payload.push(date);
        } else {
          payload.push(date);
          payload.push(currentDate);
        }

        break;
      default:
        break;
    }

    if (payload.length) {
      dispatch({ type: 'SET_DATE_FROM_PRESET', payload });
    }
  };

  // Generate the styles to pin the portal to the parent node.
  return (
    <DateRangeContainer>
      {presets ? (
        <Menu
          format="basic"
          style={{ borderRight: `1px solid ${slate(100)}` }}
        >
          <Menu.Section title="Presets">
            {presets.map(preset => {
              const label =
                typeof preset === 'number'
                  ? preset < 0
                    ? `Last ${Math.abs(preset)} days`
                    : `Next ${preset} days`
                  : preset;
              return (
                <Menu.Item
                  active={presetOption === preset}
                  onClick={() => handleSelectPreset(preset)}
                  style={{ textTransform: 'capitalize' }}
                >
                  {label}
                </Menu.Item>
              );
            })}
          </Menu.Section>
        </Menu>
      ) : null}
      <CalendarsContainer
        // hidden={!open}
        className={className}
      >
        <CalendarHeader>
          <DateField>
            <Input
              id="start–date"
              label={startInputLabel}
              value={startDateLabel}
              onChange={handleStartChange}
              onKeyDown={handleKeyDown}
              placeholder={dateFormat}
              status={startDateError ? 'negative' : 'neutral'}
              messages={{ error: startDateError }}
              // helperMsg={true}
            />
          </DateField>
          <DateField>
            <Input
              id="end-date"
              label={endInputLabel}
              value={endDateLabel}
              onChange={handleEndChange}
              onKeyDown={handleKeyDown}
              placeholder={dateFormat}
              disabled={draftStart ? false : true}
              status={endDateError ? 'negative' : 'neutral'}
              messages={{ error: endDateError }}
              // helperMsg={true}
            />
          </DateField>
        </CalendarHeader>
        <CalendarsBody>
          <Calendar
            isRange
            backOnly
            backOnClick={handleGoBackward}
            initialMonth={viewportDate}
            minDate={minDate}
            maxDate={maxDate}
            range={[draftStart, draftEnd]}
            hoverRange={[hoverStart, hoverEnd]}
            selectionStart={hoverStart ? hoverStart : draftStart}
            selectionEnd={hoverEnd ? hoverEnd : draftEnd}
            onClick={handleClick}
            onMouseEnter={handleHover}
          />
          <Calendar
            isRange
            forwardOnly
            forwardOnClick={handleGoForward}
            initialMonth={nextViewportDate}
            minDate={minDate}
            maxDate={maxDate}
            range={[draftStart, draftEnd]}
            hoverRange={[hoverStart, hoverEnd]}
            selectionStart={hoverStart ? hoverStart : draftStart}
            selectionEnd={hoverEnd ? hoverEnd : draftEnd}
            onClick={handleClick}
            onMouseEnter={handleHover}
          />
        </CalendarsBody>
        <CalendarsFooter>
          <ClearButton
            hidden={draftEnd === null}
            size="sm"
            format="primary"
            variant="minimal"
            onClick={() => void dispatch({ type: 'CLEAR' })}
          >
            Clear
          </ClearButton>
          <ApplyButton
            disabled={
              !draftStart ||
              !draftEnd ||
              startDateError !== null ||
              endDateError !== null
            }
            size="sm"
            format="secondary"
            onClick={() => void dispatch({ type: 'SAVE' })}
          >
            Apply
          </ApplyButton>
        </CalendarsFooter>
      </CalendarsContainer>
    </DateRangeContainer>
  );
}
