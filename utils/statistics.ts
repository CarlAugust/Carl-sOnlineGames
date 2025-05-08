import * as sql from '../database/sql';

export function createLeaderBoardListing(userAndGameResults: sql.UserAndGameResults[]): sql.UserAndGameResults[]
{
    const resultMap = new Map();

    for (const item of userAndGameResults) {
      if (!resultMap.has(item.user)) {
        resultMap.set(item.user, {
          user: item.user,
          score: 0,
        });
      }
      
      if (item.result === 1) {
        const userData = resultMap.get(item.user);
        userData.score += item.score;
      }
    }
  
    const leaderBoardListing = Array.from(resultMap.values()) as sql.UserAndGameResults[];
    return leaderBoardListing.sort( (a, b) => {return a.score < b.score ? 1 : -1});
  
}