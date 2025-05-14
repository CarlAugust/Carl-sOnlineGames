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
  fs.appendFile('src/visitlog.csv', `${date};${page}\n`, (err) => {
    if (err) {
      console.error(err);
    }
    else
    {
      console.log('succ');
    }
  })
}

export function getVisitLogData(dateStart: Date, dateEnd: Date)
{
  
}