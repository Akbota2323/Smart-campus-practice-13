// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import App from './App';

afterEach(cleanup);

const roomSelect = () => screen.getByLabelText('Select a room') as HTMLSelectElement;
const checkButton = () =>
  screen.getByRole('button', { name: /check availability/i }) as HTMLButtonElement;

describe('App integration (UI behavior)', () => {
  it('UI1: default room 09:00-10:00 is Unavailable because of an overlap', () => {
    render(<App />);
    fireEvent.click(checkButton());
    expect(screen.getByText('Unavailable')).toBeTruthy();
    expect(screen.getByText(/overlaps an existing booking/)).toBeTruthy();
  });

  it('UI2 (F5): changing the room clears the result and uses the new room bookings', () => {
    render(<App />);
    fireEvent.click(checkButton());
    expect(screen.getByText('Unavailable')).toBeTruthy();

    fireEvent.change(roomSelect(), { target: { value: 'room-102' } });
    expect(screen.queryByText('Unavailable')).toBeNull();

    fireEvent.click(checkButton());
    expect(screen.getByText('Available')).toBeTruthy();
  });

  it('UI3 (F4): impossible filter shows the empty state and disables checking', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('Attendees'), { target: { value: '130' } });
    expect(screen.getByText(/No rooms match your requirements/)).toBeTruthy();
    expect(screen.getByText('0 rooms match')).toBeTruthy();
    expect(checkButton().disabled).toBe(true);
    expect(roomSelect().disabled).toBe(true);
  });

  it('UI4 (F1+F2): capacity and equipment filters narrow the room list', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('Attendees'), { target: { value: '30' } });
    fireEvent.click(screen.getByLabelText('projector'));
    expect(screen.getByText('2 rooms match')).toBeTruthy();
    expect(roomSelect().options.length).toBe(2);
  });

  it('UI5 (F3): a blocked room is reported as unavailable', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('Attendees'), { target: { value: '20' } });
    fireEvent.click(screen.getByLabelText('computers'));
    fireEvent.click(screen.getByLabelText('whiteboard'));
    fireEvent.change(roomSelect(), { target: { value: 'room-103' } });
    fireEvent.click(checkButton());
    expect(screen.getByText('Unavailable')).toBeTruthy();
    expect(screen.getByText(/currently blocked/)).toBeTruthy();
  });
  it('R-02: clearing End time does not silently become midnight', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('End time'), { target: { value: '' } });
    expect((screen.getByLabelText(/End at midnight/) as HTMLInputElement).checked).toBe(false);
    fireEvent.click(checkButton());
    expect(screen.getByText(/Please enter valid times/)).toBeTruthy();
  });
  it('R-05: result banner is announced to screen readers', () => {
    render(<App />);
    fireEvent.click(checkButton());
    expect(screen.getByRole('status')).toBeTruthy();
  });

  it('UI6: Explain availability shows the labelled card without changing the status banner', async () => {
    render(<App />);
    fireEvent.click(checkButton());
    expect(screen.getByText('Unavailable')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /explain availability/i }));

    expect(
      await screen.findByText('AI-generated explanation — not a booking confirmation'),
    ).toBeTruthy();
    expect(screen.getByText(/is not available for 09:00/)).toBeTruthy();
    expect(screen.getByText('mock')).toBeTruthy();

    expect(screen.getByText('Unavailable')).toBeTruthy();
    expect(screen.getAllByText(/overlaps an existing booking/).length).toBeGreaterThan(0);
  });
});