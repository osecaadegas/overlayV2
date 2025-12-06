import './GiveawaysPage.css';

export default function GiveawaysPage() {
  return (
    <div className="giveaways-page">
      <div className="giveaways-container">
        <div className="giveaways-header">
          <h1>🎁 Giveaways</h1>
          <p className="giveaways-subtitle">Participate in amazing giveaways and win incredible prizes</p>
        </div>

        <div className="giveaways-content">
          <div className="coming-soon-banner">
            <div className="banner-icon">🎁</div>
            <h2>Giveaways Coming Soon!</h2>
            <p>Exciting giveaways are on the way! Follow us to stay updated on upcoming prizes and contests.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
