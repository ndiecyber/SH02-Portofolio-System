import React from 'react';
import { Star } from 'lucide-react';

const ClientSatisfactionCard = ({ data = {} }) => {
  const { rating = 4.8, reviewsCount = 15, breakdown = { 5: 12, 4: 2, 3: 1, 2: 0, 1: 0 } } = data;

  const renderStars = (score) => {
    const stars = [];
    const floor = Math.floor(score);
    for (let i = 1; i <= 5; i++) {
      if (i <= floor) {
        stars.push(<Star key={i} className="w-5.5 h-5.5 fill-amber-400 text-amber-400 flex-shrink-0" />);
      } else if (i - 0.5 <= score) {
        stars.push(
          <div key={i} className="relative w-5.5 h-5.5 flex-shrink-0">
            <Star className="absolute top-0 left-0 w-full h-full text-slate-300" />
            <div className="absolute top-0 left-0 w-[50%] h-full overflow-hidden">
              <Star className="w-5.5 h-5.5 fill-amber-400 text-amber-400" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="w-5.5 h-5.5 text-slate-350 flex-shrink-0" />);
      }
    }
    return stars;
  };

  return (
    <div className="glass rounded-xl p-5 border border-slate-200 h-96 flex flex-col justify-between shadow-sm">
      <div className="text-left">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Client Satisfaction</h3>
        <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Average feedback ratings</p>
      </div>

      <div className="flex items-center space-x-6 my-auto">
        <div className="space-y-1 text-left">
          <div className="text-4xl font-extrabold text-slate-900">{rating}</div>
          <div className="flex items-center space-x-1 py-1">
            {renderStars(rating)}
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Based on {reviewsCount} reviews</p>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = breakdown[stars] || 0;
            const pct = reviewsCount > 0 ? (count / reviewsCount) * 100 : 0;
            
            return (
              <div key={stars} className="flex items-center space-x-2 text-[10px] font-bold">
                <span className="text-slate-500 w-3 flex-shrink-0">{stars}</span>
                <Star className="w-3.5 h-3.5 fill-amber-400/80 text-amber-400/80 flex-shrink-0" />
                <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-amber-400 rounded-full h-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-slate-400 w-4 text-right flex-shrink-0">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ClientSatisfactionCard;
