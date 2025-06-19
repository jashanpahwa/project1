import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./css/promotions.css";

const Promotion = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [claimedOffers, setClaimedOffers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState({});

  // Sample promotion data
  const promotions = {
    all: [
      {
        id: 1,
        title: "Welcome Bonus",
        subtitle: "100% deposit match up to ₹10,000",
        description: "New players get their first deposit matched 100% with bonus funds. Minimum deposit ₹500. 25x wagering requirement applies.",
        image: "/assets/promos/welcome.jpg",
        type: "deposit",
        expiry: "2023-12-31T23:59:59",
        code: "WELCOME100",
        claimed: false
      },
      {
        id: 2,
        title: "Free Spins Friday",
        subtitle: "50 free spins every Friday",
        description: "Claim 50 free spins on our featured slot game every Friday. No deposit required. Winnings capped at ₹5,000.",
        image: "/assets/promos/freespins.jpg",
        type: "freespins",
        expiry: "2023-12-31T23:59:59",
        code: "FREEFRIDAY",
        claimed: false
      },
      {
        id: 3,
        title: "High Roller Bonus",
        subtitle: "25% extra on deposits over ₹50,000",
        description: "Get an additional 25% bonus when you deposit ₹50,000 or more. Perfect for high stakes players.",
        image: "/assets/promos/highroller.jpg",
        type: "deposit",
        expiry: "2023-11-30T23:59:59",
        code: "HIGH25",
        claimed: false
      },
      {
        id: 4,
        title: "Cashback Weekend",
        subtitle: "10% cashback on losses",
        description: "Every weekend, get 10% cashback on your net losses. Cashback credited every Monday.",
        image: "/assets/promos/cashback.jpg",
        type: "cashback",
        expiry: "2023-12-31T23:59:59",
        code: "WEEKEND10",
        claimed: false
      },
      {
        id: 5,
        title: "Refer a Friend",
        subtitle: "Get ₹1,000 for each friend",
        description: "Invite friends to join BetX and earn ₹1,000 for each successful referral. Your friend gets ₹500 too!",
        image: "/assets/promos/referral.jpg",
        type: "referral",
        expiry: null,
        code: "REFER1000",
        claimed: false
      },
      {
        id: 6,
        title: "Birthday Bonus",
        subtitle: "Special gift on your birthday",
        description: "Celebrate your birthday with us! Get a special bonus during your birthday month.",
        image: "/assets/promos/birthday.jpg",
        type: "special",
        expiry: null,
        code: "HAPPYBDAY",
        claimed: false
      }
    ],
    active: [1, 2, 4, 5, 6],
    expiring: [3]
  };

  // Calculate time remaining for each promotion
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const newTimeRemaining = {};
      promotions.all.forEach(promo => {
        if (promo.expiry) {
          const expiryDate = new Date(promo.expiry).getTime();
          const now = new Date().getTime();
          const distance = expiryDate - now;
          
          if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            newTimeRemaining[promo.id] = {
              days,
              hours,
              minutes,
              seconds
            };
          } else {
            newTimeRemaining[promo.id] = "expired";
          }
        }
      });
      setTimeRemaining(newTimeRemaining);
    };

    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(timer);
  }, []);

  const claimOffer = (id) => {
    setClaimedOffers([...claimedOffers, id]);
    // In a real app, you would call an API here
    alert(`Promotion claimed! Use code: ${promotions.all.find(p => p.id === id).code}`);
  };

  const filteredPromotions = promotions.all.filter(promo => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return promotions.active.includes(promo.id);
    if (activeTab === "expiring") return promotions.expiring.includes(promo.id);
    if (activeTab === "claimed") return claimedOffers.includes(promo.id);
    return promo.type === activeTab;
  });

  const PromotionCard = ({ promo }) => {
    const isClaimed = claimedOffers.includes(promo.id);
    const isExpired = promo.expiry && timeRemaining[promo.id] === "expired";
    
    return (
      <div className={`promo-card ${isClaimed ? "claimed" : ""} ${isExpired ? "expired" : ""}`}>
        <div className="promo-image" style={{ backgroundImage: `url(${promo.image})` }}>
          {isExpired && <div className="expired-badge">Expired</div>}
          {isClaimed && <div className="claimed-badge">Claimed</div>}
          {promo.type === "deposit" && <div className="type-badge">Deposit Bonus</div>}
          {promo.type === "freespins" && <div className="type-badge">Free Spins</div>}
          {promo.type === "cashback" && <div className="type-badge">Cashback</div>}
          {promo.type === "referral" && <div className="type-badge">Referral</div>}
          {promo.type === "special" && <div className="type-badge">Special</div>}
        </div>
        <div className="promo-content">
          <h3>{promo.title}</h3>
          <p className="subtitle">{promo.subtitle}</p>
          <p className="description">{promo.description}</p>
          
          {promo.expiry && timeRemaining[promo.id] && timeRemaining[promo.id] !== "expired" && (
            <div className="countdown">
              <span>Ends in:</span>
              <div className="countdown-timer">
                <span>{timeRemaining[promo.id].days}d</span>
                <span>{timeRemaining[promo.id].hours}h</span>
                <span>{timeRemaining[promo.id].minutes}m</span>
                <span>{timeRemaining[promo.id].seconds}s</span>
              </div>
            </div>
          )}
          
          <div className="promo-actions">
            {!isClaimed && !isExpired ? (
              <>
                <button 
                  className="claim-btn"
                  onClick={() => claimOffer(promo.id)}
                >
                  Claim Now
                </button>
                {promo.code && (
                  <div className="promo-code">
                    <span>Code:</span>
                    <strong>{promo.code}</strong>
                  </div>
                )}
              </>
            ) : isClaimed ? (
              <button className="claimed-btn" disabled>
                Already Claimed
              </button>
            ) : (
              <button className="expired-btn" disabled>
                Offer Expired
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="promotions-page">
      {/* Hero Section */}
      <div className="promo-hero">
        <div className="hero-content">
          <h1>Promotions & Bonuses</h1>
          <p>Boost your play with our exclusive offers and bonuses</p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="promo-container">
        {/* Promotion Tabs */}
        <div className="promo-tabs">
          <button 
            className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Offers
          </button>
          <button 
            className={`tab-btn ${activeTab === "active" ? "active" : ""}`}
            onClick={() => setActiveTab("active")}
          >
            Active
          </button>
          <button 
            className={`tab-btn ${activeTab === "expiring" ? "active" : ""}`}
            onClick={() => setActiveTab("expiring")}
          >
            Ending Soon
          </button>
          <button 
            className={`tab-btn ${activeTab === "deposit" ? "active" : ""}`}
            onClick={() => setActiveTab("deposit")}
          >
            Deposit Bonuses
          </button>
          <button 
            className={`tab-btn ${activeTab === "freespins" ? "active" : ""}`}
            onClick={() => setActiveTab("freespins")}
          >
            Free Spins
          </button>
          <button 
            className={`tab-btn ${activeTab === "claimed" ? "active" : ""}`}
            onClick={() => setActiveTab("claimed")}
          >
            My Claims
          </button>
        </div>
        
        {/* Promotions Grid */}
        <div className="promo-grid">
          {filteredPromotions.length > 0 ? (
            filteredPromotions.map(promo => (
              <PromotionCard key={promo.id} promo={promo} />
            ))
          ) : (
            <div className="no-promos">
              <div className="empty-icon">🎁</div>
              <h3>No promotions available</h3>
              <p>Check back later for new offers</p>
              {activeTab === "claimed" && (
                <Link to="/promotions" className="browse-btn">
                  Browse All Offers
                </Link>
              )}
            </div>
          )}
        </div>
        
        {/* Terms Section */}
        <div className="terms-section">
          <h3>Promotion Terms & Conditions</h3>
          <ul>
            <li>All bonuses are subject to wagering requirements before withdrawal</li>
            <li>Minimum deposit requirements may apply for certain bonuses</li>
            <li>Only one welcome bonus can be claimed per account</li>
            <li>Bonus funds are non-withdrawable until wagering is complete</li>
            <li>BetX reserves the right to modify or cancel promotions at any time</li>
            <li>Standard terms and conditions apply to all promotions</li>
          </ul>
          <Link to="/terms" className="terms-link">
            View Full Terms and Conditions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Promotion;