//
//  TereshkovaView.m
//  tereshkova
//
//  Created by Justin Palmer on 12/30/15.
//  Copyright © 2015 Justin Palmer. All rights reserved.
//

#import "TereshkovaView.h"

@implementation TereshkovaView

- (instancetype)initWithFrame:(NSRect)frame isPreview:(BOOL)isPreview
{
    self = [super initWithFrame:frame isPreview:isPreview];
    if (self) {
        webView = [[WebView alloc] initWithFrame:[self bounds] frameName:nil groupName:nil];
        [webView setDrawsBackground:NO];
        [webView setMainFrameURL:[NSString stringWithFormat:@"file://%@/index.html", [[NSBundle bundleForClass:[self class]] resourcePath]]];
        [self addSubview:webView];
    }
    return self;
}

- (void)startAnimation
{
    [super startAnimation];
}

- (void)stopAnimation
{
    [super stopAnimation];
}

- (void)drawRect:(NSRect)rect
{
    [super drawRect:rect];
}

- (void)animateOneFrame
{
    return;
}

- (BOOL)hasConfigureSheet
{
    return NO;
}

- (NSWindow*)configureSheet
{
    return nil;
}

@end
