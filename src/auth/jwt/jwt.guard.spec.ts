import { JwtAuthGuard } from './jwt.guard';
import { SetMetadata } from '@nestjs/common';
describe('JwtGuard', () => {
  it('should be defined', () => {
    expect(new JwtAuthGuard()).toBeDefined();
  });
});
