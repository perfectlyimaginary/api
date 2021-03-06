import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import {
  CharacterPostedOnAllianceWallEvent,
  CharacterPostedOnCharacterWallEvent, CharacterPostedOnCorporationWallEvent, CharacterPostedEvent,
} from '../create.character.event';
import {
  CorporationPostedOnCharacterWallEvent,
  CorporationPostedOnCorporationWallEvent,
  CorporationPostedOnAllianceWallEvent,
  CorporationPostedEvent,
} from '../create.corporation.event';
import {
  AlliancePostedOnCharacterWallEvent,
  AlliancePostedOnCorporationWallEvent,
  AlliancePostedOnAllianceWallEvent,
  AlliancePostedEvent,
} from '../create.alliance.event';
import { PostedEvent } from '../create.event';
import { WebsocketGateway } from '../../../websocket/websocket.gateway';
import { Character } from '../../../character/character.entity';
import { Corporation } from '../../../corporation/corporation.entity';
import { Alliance } from '../../../alliance/alliance.entity';
import { DPost } from '../../post.dto';

@EventsHandler(
  CharacterPostedEvent,
  CharacterPostedOnCharacterWallEvent,
  CharacterPostedOnCorporationWallEvent,
  CharacterPostedOnAllianceWallEvent,
  CorporationPostedEvent,
  CorporationPostedOnCharacterWallEvent,
  CorporationPostedOnCorporationWallEvent,
  CorporationPostedOnAllianceWallEvent,
  AlliancePostedEvent,
  AlliancePostedOnCharacterWallEvent,
  AlliancePostedOnCorporationWallEvent,
  AlliancePostedOnAllianceWallEvent,
)
export class AnyonePostedEventHandler implements IEventHandler<PostedEvent> {

  constructor(
    private websocketGateway: WebsocketGateway,
  ) {
  }

  async handle(event: PostedEvent) {
    const post = new DPost(event.post);

    // Send event for hashtags
    for (const hashtag of event.post.hashtags) {
      await this.websocketGateway.sendEventToHashtagWallSub<DPost>(hashtag, post);
    }

    // First check if it was posted on wall
    // else check who posted it
    const sendTo = event.post.characterWall
      || event.post.corporationWall
      || event.post.allianceWall
      || event.post.character
      || event.post.corporation
      || event.post.alliance;

    // and send it to correct wall
    if (sendTo instanceof Character) {
      await this.websocketGateway.sendEventToCharacterWallSub<DPost>(sendTo, post);
    }
    if (sendTo instanceof Corporation) {
      await this.websocketGateway.sendEventToCorporationWallSub<DPost>(sendTo, post);
    }
    if (sendTo instanceof Alliance) {
      await this.websocketGateway.sendEventToAllianceWallSub<DPost>(sendTo, post);
    }

    // Also send it to latest
    await this.websocketGateway.sendEventToLatestWallSub<DPost>(post);
  }
}
