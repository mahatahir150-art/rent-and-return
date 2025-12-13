import { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, MessageCircle, Phone } from 'lucide-react';
import Button from '../components/Button';

const HelpSupport = () => {
    const [openFaq, setOpenFaq] = useState(null);

    const faqs = [
        {
            question: "How do I rent an item?",
            answer: "Simply browse the products, click on the item you want, select your rental dates, and click 'Rent Now'. The owner will approve your request shortly."
        },
        {
            question: "Is my payment secure?",
            answer: "Yes, we use a secure mocked digital banking system. Your funds are held in escrow until the rental period is successfully completed."
        },
        {
            question: "What if the item is damaged?",
            answer: "We recommend taking photos before and after the rental. If damage occurs, our dispute resolution team will mediate based on the evidence provided."
        },
        {
            question: "How do I verify my account?",
            answer: "Go to your Profile page and click on 'Verify Account'. You will need to upload a valid ID and a selfie."
        }
    ];

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Header Removed as it will be in Dashboard */}

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem', maxWidth: '400px', width: '100%' }}>
                    <div style={{ background: 'rgba(212, 160, 23, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem', color: 'var(--secondary)' }}>
                        <Mail size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Email Support</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Response within 24h</p>
                    <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>rentandreturn.help@gmail.com</p>
                </div>
            </div>

            <div className="card" style={{ padding: '2rem', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '1rem' }}>Frequently Asked Questions</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {faqs.map((faq, index) => (
                        <div key={index} style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                            <button
                                onClick={() => toggleFaq(index)}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1rem',
                                    background: 'var(--bg-main)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontWeight: '600',
                                    fontSize: '1rem',
                                    color: 'var(--text-main)'
                                }}
                            >
                                {faq.question}
                                {openFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            {openFaq === index && (
                                <div style={{ padding: '1rem', borderTop: '1px solid rgba(0,0,0,0.1)', background: 'white', color: 'var(--text-muted)' }}>
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Send us a Message</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="input-group">
                        <label className="label">Subject</label>
                        <input type="text" className="input-field" placeholder="How can we help?" />
                    </div>
                    <div className="input-group">
                        <label className="label">Message</label>
                        <textarea className="input-field" rows="4" placeholder="Describe your issue..."></textarea>
                    </div>
                    <Button>
                        <MessageCircle size={18} style={{ marginRight: '0.5rem' }} />
                        Send Message
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HelpSupport;
