import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthCheckService, private readonly dbHealthIndicator: TypeOrmHealthIndicator) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([async () => this.dbHealthIndicator.pingCheck('database', { timeout: 300 })]);
  }
}
