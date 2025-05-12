import * as sql from '../database/sql';
import fs from 'fs';

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

export function insertIntoVisitLog(date: Date, page: String)
{
  console.log('Broo!');
  try {
    fs.writeFileSync('src/visitlog.csv', `${date.toDateString()};${page}\n`);
  }
  catch (err) {
    console.error(err);
  }
}

export function getVisitLogData(dateStart: Date, dateEnd: Date)
{
  
}