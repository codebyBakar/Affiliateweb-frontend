import Icon from './Icon.jsx';

export default function Stars({ rating = 0, size = 12 }) {
  const roundedRating = Math.round(rating * 2) / 2;
  const fullStars = Math.floor(roundedRating);
  const hasHalfStar = roundedRating % 1 === 0.5;

  return (
    <span style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => {
        if (n <= fullStars) {
          return (
            <Icon
              key={n}
              name="star"
              size={size}
              fill="#F5C842"
              stroke="#F5C842"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          );
        }
        if (n === fullStars + 1 && hasHalfStar) {
          return (
            <Icon
              key={n}
              name="star-half"
              size={size}
              fill="#F5C842"
              stroke="#F5C842"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          );
        }
        return (
          <Icon
            key={n}
            name="star"
            size={size}
            fill="none"
            stroke="#F5C842"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        );
      })}
    </span>
  );
}