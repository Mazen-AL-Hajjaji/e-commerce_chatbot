import React from "react";
import "../styles/Card.css";

export default function Card({ payload, card }) {
  if (payload) {
    const { header, image, description, price, link } = payload.fields;
    return (
      <div className="bot-card">
        <div className="card">
          <div className="card-image">
            <img
              alt={header.stringValue}
              src={image.stringValue}
              className="card-img"
            />
            <span className="card-title">{header.stringValue}</span>
          </div>
          <div className="card-content">
            <p>{description.stringValue}</p>
            <p>
              <strong>{price.stringValue}</strong>
            </p>
          </div>
          <div className="card-action">
            <a
              href={link.stringValue}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get now
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (card) {
    return (
      <div className="bot-card">
        <div className="card">
          <div className="card-image">
            <img
              alt={card.title}
              src={card.image?.src?.rawUrl}
              className="card-img"
            />
            <span className="card-title">{card.title}</span>
          </div>
          <div className="card-content">
            <p>{card.subtitle}</p>
          </div>
          <div className="card-action">
            {card.buttons &&
              card.buttons.map((btn, i) => (
                <a
                  key={i}
                  href={btn.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {btn.text}
                </a>
              ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
