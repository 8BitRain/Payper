import db from '../_MOCK_DB'

export default class User {
  constructor() {
    this.uid = "uid1"
    this.initialize()
  }

  initialize() {
    for (var k in db.user[this.uid]) this[k] = db.user[this.uid][k]
    this.broadcastFeed = db.userBroadcastFeed[this.uid]
  }
}
