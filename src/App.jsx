import './App.css';
import { useMemo, useState } from 'react';

const destinations = [
  { city: 'New York', region: 'United States', code: 'NYC' },
  { city: 'Boston', region: 'United States', code: 'BOS' },
  { city: 'Washington D.C.', region: 'United States', code: 'WAS' },
  { city: 'Philadelphia', region: 'United States', code: 'PHL' },
  { city: 'Chicago', region: 'United States', code: 'CHI' },
];

const distanceMap = {
  'New York-Boston': 346,
  'New York-Washington D.C.': 367,
  'New York-Philadelphia': 152,
  'New York-Chicago': 1272,
  'Boston-Washington D.C.': 714,
  'Boston-Philadelphia': 533,
  'Boston-Chicago': 1603,
  'Washington D.C.-Philadelphia': 225,
  'Chicago-Philadelphia': 1205,
  'Chicago-Washington D.C.': 1145,
};

const transportOptions = [
  { id: 'car', label: 'Car', icon: 'CAR', rate: 0.22, detail: 'Door-to-door comfort' },
  { id: 'bus', label: 'Bus', icon: 'BUS', rate: 0.1, detail: 'Low fare, easy ride' },
  { id: 'plane', label: 'Plane', icon: 'AIR', rate: 0.48, detail: 'Fastest connection' },
];

const initialHistory = [
  { from: 'New York', to: 'Boston', mode: 'Bus', date: 'Aug 14, 2026', distance: 346, price: 34.6, status: 'Completed' },
  { from: 'Chicago', to: 'New York', mode: 'Plane', date: 'Jul 28, 2026', distance: 1272, price: 610.56, status: 'Completed' },
];

function getDistance(from, to) {
  return distanceMap[`${from}-${to}`] || distanceMap[`${to}-${from}`] || 0;
}

function App() {
  const [page, setPage] = useState('home');
  const [from, setFrom] = useState('New York');
  const [to, setTo] = useState('Boston');
  const [mode, setMode] = useState('car');
  const [history, setHistory] = useState(initialHistory);
  const [confirmed, setConfirmed] = useState(false);

  const selectedTransport = transportOptions.find((option) => option.id === mode);
  const distance = getDistance(from, to);
  const price = useMemo(() => distance * (selectedTransport?.rate || 0), [distance, selectedTransport]);

  const changePage = (nextPage) => {
    setConfirmed(false);
    setPage(nextPage);
  };

  const swapLocations = () => {
    setFrom(to);
    setTo(from);
  };

  const confirmTrip = () => {
    const trip = {
      from,
      to,
      mode: selectedTransport.label,
      date: 'Aug 25, 2026',
      distance,
      price,
      status: 'Upcoming',
    };
    setHistory((currentHistory) => [trip, ...currentHistory]);
    setConfirmed(true);
  };

  return (
    <div className="App">
      <header className="site-header">
        <button className="brand" onClick={() => changePage('home')} aria-label="Go to home">
          <span className="brand-mark">+</span>
          <span>Roamly</span>
        </button>
        <nav className="main-nav" aria-label="Main navigation">
          <button className={page === 'home' ? 'active' : ''} onClick={() => changePage('home')}>Home</button>
          <button className={page === 'travel' ? 'active' : ''} onClick={() => changePage('travel')}>My travel</button>
        </nav>
        <div className="header-profile"><span className="avatar">NS</span><span>Nishitha</span><span className="chevron">v</span></div>
      </header>

      <main>
        {page === 'home' && (
          <section className="home-page page-shell">
            <div className="hero-copy">
              <p className="eyebrow">TRAVEL, BETTER CONNECTED</p>
              <h1>Go somewhere<br /><em>worth going.</em></h1>
              <p className="hero-intro">One simple place to compare routes, choose your ride, and make the journey yours.</p>
            </div>

            <div className="booking-panel">
              <div className="panel-heading"><div><span className="section-kicker">PLAN A NEW TRIP</span><h2>Where are you headed?</h2></div><span className="step-count">01 <i /> 03</span></div>
              <div className="route-fields">
                <label><span>FROM</span><select value={from} onChange={(event) => setFrom(event.target.value)}>{destinations.map((place) => <option key={place.city}>{place.city}</option>)}</select><small>{destinations.find((place) => place.city === from)?.code}</small></label>
                <button className="swap-button" onClick={swapLocations} aria-label="Swap departure and arrival">&#8596;</button>
                <label><span>TO</span><select value={to} onChange={(event) => setTo(event.target.value)}>{destinations.map((place) => <option key={place.city}>{place.city}</option>)}</select><small>{destinations.find((place) => place.city === to)?.code}</small></label>
              </div>
              <div className="transport-picker"><span className="field-label">HOW DO YOU WANT TO GO?</span><div className="transport-options">{transportOptions.map((option) => <button key={option.id} className={mode === option.id ? 'transport-option selected' : 'transport-option'} onClick={() => setMode(option.id)}><span className="transport-icon">{option.icon}</span><span><strong>{option.label}</strong><small>{option.detail}</small></span>{mode === option.id && <span className="selected-dot">&#10003;</span>}</button>)}</div></div>
              {from === to ? <p className="route-warning">Choose two different cities to see your fare.</p> : <div className="fare-preview"><span><strong>{distance.toLocaleString()} km</strong><small>estimated route distance</small></span><span className="fare-value"><small>ESTIMATED FARE</small><strong>${price.toFixed(2)}</strong></span></div>}
              <button className="primary-button" disabled={from === to} onClick={() => changePage('confirmation')}>Review trip <span>&#8594;</span></button>
            </div>
            <div className="home-footnote"><span>LOCAL KNOWLEDGE, BUILT IN</span><span>Rates update by route distance</span><span>Secure checkout</span></div>
          </section>
        )}

        {page === 'travel' && (
          <section className="page-shell travel-page"><div className="page-title"><div><p className="eyebrow">YOUR JOURNEYS</p><h1>My travel</h1><p>Every route you have taken, all in one place.</p></div><button className="primary-button compact" onClick={() => changePage('home')}>Plan another trip <span>+</span></button></div><div className="travel-summary"><div><span className="summary-number">{history.length}</span><span>total trips</span></div><div><span className="summary-number">{history.reduce((total, trip) => total + trip.distance, 0).toLocaleString()}</span><span>km traveled</span></div><div><span className="summary-number">${history.reduce((total, trip) => total + trip.price, 0).toFixed(2)}</span><span>total spent</span></div></div><div className="history-list"><div className="list-header"><span>TRIP HISTORY</span><span>{history.length} journeys</span></div>{history.map((trip, index) => <article className="history-item" key={`${trip.date}-${index}`}><div className="trip-index">{String(index + 1).padStart(2, '0')}</div><div className="trip-route"><strong>{trip.from} <span>&#8594;</span> {trip.to}</strong><small>{trip.date} <i /> {trip.distance.toLocaleString()} km</small></div><div className="trip-mode"><span className={`mode-chip ${trip.mode.toLowerCase()}`}>{trip.mode === 'Plane' ? 'AIR' : trip.mode.toUpperCase()}</span><span>{trip.status}</span></div><strong className="trip-price">${trip.price.toFixed(2)}</strong></article>)}</div></section>
        )}

        {page === 'confirmation' && (
          <section className="page-shell confirmation-page"><div className="confirmation-intro"><p className="eyebrow">ALMOST THERE</p><h1>Check your<br /><em>trip details.</em></h1><p>Make sure everything looks right before you set off.</p></div><div className="confirmation-card"><div className="card-top"><span className="section-kicker">TRIP SUMMARY</span><span className="status-label">READY TO BOOK</span></div><div className="big-route"><div><small>DEPARTING FROM</small><strong>{from}</strong><span>{destinations.find((place) => place.city === from)?.code}</span></div><span className="route-line"><i /><b>&#8594;</b><i /></span><div className="arrival"><small>ARRIVING IN</small><strong>{to}</strong><span>{destinations.find((place) => place.city === to)?.code}</span></div></div><div className="detail-grid"><div><small>TRANSPORT</small><strong>{selectedTransport.label}</strong></div><div><small>DISTANCE</small><strong>{distance.toLocaleString()} km</strong></div><div><small>TRAVEL DATE</small><strong>Aug 25, 2026</strong></div><div><small>PASSENGERS</small><strong>1 traveler</strong></div></div><div className="total-row"><span>Total trip fare</span><strong>${price.toFixed(2)}</strong></div><button className="primary-button" onClick={confirmTrip}>{confirmed ? 'Trip confirmed' : 'Confirm and book'} <span>{confirmed ? '&#10003;' : '&#8594;'}</span></button>{confirmed && <p className="confirmation-success">Your trip has been added to My travel.</p>}</div><button className="back-link" onClick={() => changePage('home')}>&#8592; Edit trip details</button></section>
        )}
      </main>
      <footer><span>ROAMLY / 2026</span><span>Made for the miles ahead.</span></footer>
    </div>
  );
}

export default App;
