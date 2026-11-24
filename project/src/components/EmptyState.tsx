import { CARD_CLASS } from './styles';

export function EmptyState() {
  return (
    <div className={CARD_CLASS}>
      <p className="text-sm text-slate-600">
        No rooms match your requirements. Try fewer attendees or less equipment.
      </p>
    </div>
  );
}