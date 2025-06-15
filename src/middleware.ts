import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { user } } = await supabase.auth.getUser();

  // Check if user is authenticated
  if (!user) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Get user's Discord ID from metadata
  const discordId = user.user_metadata?.sub;
  if (!discordId) {
    console.error('No Discord ID found in user metadata');
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Check if user is a member of the Discord server using bot token
  const isServerMember = await checkDiscordServerMembership(discordId);
  if (!isServerMember) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
}

async function checkDiscordServerMembership(discordId: string): Promise<boolean> {
  try {
    const botToken = process.env.DISCORD_BOT_TOKEN;
    if (!botToken) {
      console.error('Discord bot token not found');
      return false;
    }

    const response = await fetch(
      `https://discord.com/api/v10/guilds/989146199556780052/members/${discordId}`,
      {
        headers: {
          Authorization: `Bot ${botToken}`,
        },
      }
    );
    console.log(response)

    if (!response.ok) {
      console.error('Discord API error:', await response.text());
      return false;
    }

    const member = await response.json();
    console.log('Server member data:', member); // デバッグ用
    return true;
  } catch (error) {
    console.error('Error checking Discord server membership:', error);
    return false;
  }
}

export const config = {
  matcher: [
    '/lecture',
    '/lecture/:path*'
  ],
}; 