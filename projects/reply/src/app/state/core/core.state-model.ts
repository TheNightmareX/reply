import { ActionStatus } from '../../core/action-status';
import { Authorization } from '../../core/authorization.model';
import { BreakpointMap } from '../../core/breakpoint.service';

export interface CoreState {
  breakpoints: BreakpointMap;

  authorization: Authorization | null;
  authenticationStatus: ActionStatus;
}
