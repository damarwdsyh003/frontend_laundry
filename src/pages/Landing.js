import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
    return (
        <main className="landing-page">
            <section className="landing-hero">
                <div className="container">
                    <nav className="landing-nav">
                        <Link to="/" className="brand-mark landing-brand">
                            <span className="brand-icon">✦</span>
                            FreshFold
                        </Link>
                        <div className="landing-nav-actions">
                            <span className="nav-note">Laundry operations, clarified.</span>
                            <Link to="/login" className="btn btn-link-quiet">Sign in</Link>
                            <Link to="/register" className="btn btn-primary-soft">Open the board</Link>
                        </div>
                    </nav>

                    <div className="landing-board">
                        <div className="landing-copy">
                            <span className="eyebrow"><span className="pulse-dot" /> The daily wash log</span>
                            <p className="hero-index">No. 01 <span>— your next clean run</span></p>
                            <h1>Laundry,<br /><em>in motion.</em></h1>
                            <p className="hero-text">
                                A quietly powerful place to move every order from drop-off
                                to done. No clutter. No guessing. Just a clear next step.
                            </p>
                            <div className="hero-actions">
                                <Link to="/register" className="btn btn-primary btn-lg">Start a clean run <span>↗</span></Link>
                                <Link to="/login" className="hero-text-link">I already have a board</Link>
                            </div>
                        </div>

                        <div className="board-visual" aria-label="Laundry workflow preview">
                            <div className="board-stamp">OPEN<br />ALL DAY</div>
                            <div className="board-line board-line-one" />
                            <div className="board-line board-line-two" />
                            <div className="workflow-column">
                                <div className="workflow-label"><span>01</span> DROP-OFF</div>
                                <div className="workflow-ticket ticket-blue"><span>LF</span><strong>Lee Family</strong><small>Wash &amp; fold · 3 bags</small><b>09:20</b></div>
                                <div className="workflow-ticket ticket-cream"><span>AP</span><strong>Ayu Putri</strong><small>Express wash · 1 bag</small><b>10:45</b></div>
                            </div>
                            <div className="workflow-column workflow-column-middle">
                                <div className="workflow-label"><span>02</span> IN THE LOOP</div>
                                <div className="workflow-ticket ticket-dark"><span>JD</span><strong>Jeno D.</strong><small>Drying · almost there</small><b>11:10</b></div>
                                <div className="loop-note">keep it<br /><em>moving</em> <span>↘</span></div>
                            </div>
                            <div className="workflow-column workflow-column-last">
                                <div className="workflow-label"><span>03</span> READY</div>
                                <div className="ready-number">12</div>
                                <p>orders ready<br />for pickup</p>
                                <div className="ready-arrow">→</div>
                            </div>
                        </div>
                    </div>
                    <div className="landing-scroll-note"><span>Scroll to inspect the system</span><i>↓</i></div>
                </div>
            </section>

            <section className="landing-features">
                <div className="container">
                    <div className="feature-intro">
                        <span className="eyebrow">One small system</span>
                        <h2>Every pile has a place.</h2>
                        <p>FreshFold turns the parts of a busy laundry day into a rhythm your whole team can read.</p>
                    </div>
                    <div className="feature-strip">
                        <div className="feature-card"><span className="feature-number">01</span><h3>Know the queue</h3><p>Members and orders stay visible from the first hello.</p></div>
                        <div className="feature-card"><span className="feature-number">02</span><h3>Move with intent</h3><p>Packages and status changes live in one shared flow.</p></div>
                        <div className="feature-card"><span className="feature-number">03</span><h3>Close the day clean</h3><p>See the work, the income, and what is ready next.</p></div>
                    </div>
                </div>
            </section>
        </main>
    );
}
