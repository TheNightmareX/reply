import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

@Component({
  selector: 'rpl-settings-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './settings-button.component.html',
  styleUrls: ['./settings-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsButtonComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
