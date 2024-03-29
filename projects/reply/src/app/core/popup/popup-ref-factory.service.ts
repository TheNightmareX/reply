import { EventEmitter, Injectable } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { map, merge, Subject, takeUntil } from 'rxjs';

import {
  PopupCloseEvent,
  PopupContext,
  PopupDisplayEvent,
  PopupOutputEvent,
  PopupRef,
} from './popup.core';
import { PopupContainerComponent } from './popup-container.component';

@Injectable({
  providedIn: 'root',
})
export class DialogOrBottomSheetPopupRefFactory {
  fromDialogRef<Input, Output>(
    context: PopupContext<Input, Output>,
    dialogRef: MatDialogRef<PopupContainerComponent<Input, Output>>,
  ): PopupRef<Input, Output> {
    const output = new EventEmitter<Output>();
    const output$ = output.pipe(takeUntil(dialogRef.afterClosed()));
    return {
      input: context.input,
      appearance: 'dialog',
      event$: merge(
        dialogRef
          .afterClosed()
          .pipe(map((): PopupCloseEvent => ({ type: 'close' }))),
        dialogRef
          .afterOpened()
          .pipe(map((): PopupDisplayEvent => ({ type: 'display' }))),
        output$.pipe(
          map(
            (p): PopupOutputEvent<Output> => ({ type: 'output', payload: p }),
          ),
        ),
      ),
      output: (payload) => {
        output.emit(payload);
      },
      close: () => {
        dialogRef.close();
      },
    };
  }

  fromBottomSheetRef<Input, Output>(
    context: PopupContext<Input, Output>,
    bottomSheetRef: MatBottomSheetRef<PopupContainerComponent<Input, Output>>,
  ): PopupRef<Input, Output> {
    const output$ = new Subject<Output>();
    return {
      input: context.input,
      appearance: 'bottom-sheet',
      event$: merge(
        bottomSheetRef
          .afterDismissed()
          .pipe(map((): PopupCloseEvent => ({ type: 'close' }))),
        bottomSheetRef
          .afterOpened()
          .pipe(map((): PopupDisplayEvent => ({ type: 'display' }))),
        output$.pipe(
          map(
            (p): PopupOutputEvent<Output> => ({ type: 'output', payload: p }),
          ),
        ),
      ),
      output: (payload) => {
        output$.next(payload);
      },
      close: () => {
        output$.complete();
        bottomSheetRef.dismiss();
      },
    };
  }
}
